const fetch = require('isomorphic-unfetch');

const API_KEY = process.env.YELP_API_KEY;
const BASE_URL = 'https://api.yelp.com/v3';

/** Business search radius, in meters */
const SEARCH_RADIUS = 20000;
/** Number of businesses to return in search */
const SEARCH_LIMIT = 20;

/**
 * Given a URL and a dictionary of query parameters, returns a URL with a populated query string
 *
 * @param {string} baseUrl
 * @param {Record<string, string>} params
 * @returns {string}
 */
function createUrlWithParams(baseUrl, params = {}) {
  const url = new URL(baseUrl);

  for (let [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  return url.toString();
}

/**
 * Searches for businesses with the given constraints using the Yelp API and returns results
 *
 * @param {object} options
 * @returns {object[]} array of businesses found with the given options
 */
exports.searchBusinesses = async function ({ location }) {
  const results = await fetch(
    createUrlWithParams(`${BASE_URL}/businesses/search`, {
      location,
      radius: SEARCH_RADIUS,
      categories: 'coffee',
      sort_by: 'review_count',
      limit: SEARCH_LIMIT,
    }),
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  ).then((res) => res.json());

  /** Swallow errors from Yelp for convenience */
  if (!results.businesses) {
    return [];
  }

  return results.businesses;
};
