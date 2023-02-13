const {
  getAllLocations,
  getLocation,
  insertLocation,
  insertBusinesses,
  getBusinessesForLocation,
} = require('./db/query');
const { searchBusinesses } = require('./yelp');
const express = require('express');
const router = express.Router();
const compareDates = require('date-fns/compareAsc');
const addDuration = require('date-fns/add');

/**
 * Configures the maximum allowed age of cached data. Must be a date-fns Duration object.
 * (see https://date-fns.org/v2.29.3/docs/Duration)
 */
const MAX_CACHE_STALENESS = { minutes: 5 };

function computeAverageRating(businesses = []) {
  if (!businesses.length) return 0;

  return (
    businesses.map((business) => business.rating).reduce((a, b) => a + b, 0) / businesses.length
  );
}

function computeLikelyCityName(businesses = []) {
  if (!businesses.length) return undefined;

  const cities = new Set(businesses.map((b) => b.location.city));
  const occurrences = new Map([...cities].map((city) => [city, 0]));

  let mostFrequent;

  for (const business of businesses) {
    const cityName = business.location.city;
    const newCount = occurrences.get(cityName) + 1;
    occurrences.set(cityName, newCount);

    mostFrequent = newCount > (occurrences.get(mostFrequent) || 0) ? cityName : mostFrequent;
  }

  return mostFrequent;
}

function isCachedDataValid(lastUpdatedDate) {
  const stalenessDate = addDuration(new Date(lastUpdatedDate), MAX_CACHE_STALENESS);

  // Returns 1 if the first date is after the second
  return compareDates(stalenessDate, new Date()) > 0;
}

/** Get a list of all locations and their captured aggregate data */
router.get('/location', async (req, res) => {
  const locations = await getAllLocations();

  return res.status(200).json(locations);
});

/** Get aggregate data of coffee shops at a single zip code */
router.get('/location/:zip_code', async (req, res) => {
  const { zip_code } = req.params;

  if (!zip_code || zip_code.length !== 5) {
    return res.status(400).json({
      message: 'Invalid zip code, please use a valid 5-digit zip code',
    });
  }

  try {
    // Requests with ?forceRefresh=true will refetch data from Yelp every time
    if (!req.query.forceRefresh) {
      const [locationData, businesses] = await Promise.all([
        getLocation(zip_code),
        getBusinessesForLocation(zip_code),
      ]);

      if (locationData && isCachedDataValid(new Date(locationData.last_updated))) {
        // Return cached data
        return res.status(200).json({ ...locationData, businesses });
      }
    }

    const searchResults = await searchBusinesses({ location: zip_code });
    const averageRating = computeAverageRating(searchResults);
    const locationName = computeLikelyCityName(searchResults);
    const locationData = await insertLocation({
      zip_code,
      average_rating: averageRating,
      location_name: locationName,
    });
    await insertBusinesses(zip_code, searchResults);
    const businesses = await getBusinessesForLocation(zip_code);

    // Return new data
    return res.status(200).json({ ...locationData.at(0), businesses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/** Get detailed data for all businesses associated with a zip code */
router.get('/businesses/:zip_code', async (req, res) => {
  const { zip_code } = req.params;

  if (!zip_code || zip_code.length !== 5) {
    return res.status(400).json({
      message: 'Invalid zip code, please use a valid 5-digit zip code',
    });
  }

  try {
    const businesses = await getBusinessesForLocation(zip_code);

    return res.status(200).json(businesses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
