const db = require('./db');

exports.getAllLocations = function () {
  return db.select().from('locations');
};

exports.getLocation = function (zip_code) {
  return db.first().from('locations').where('zip_code', zip_code);
};

exports.insertLocation = function ({ zip_code, average_rating, location_name } = {}) {
  if (!zip_code) {
    throw new Error('Location must include a "zip_code"');
  }

  if (average_rating == null) {
    throw new Error('Location must include an average rating');
  }

  return db('locations')
    .returning('*')
    .insert({ zip_code, average_rating, location_name, last_updated: new Date() })
    .onConflict('zip_code')
    .merge();
};

exports.insertBusinesses = function (zip_code, businesses = []) {
  return db.transaction(async (tx) => {
    const businessesToInsert = businesses.map((business) => ({
      id: business.id,
      name: business.name,
      rating: business.rating,
      review_count: business.review_count,
    }));

    const insertedBusinesses = await tx('businesses')
      .returning('*')
      .insert(businessesToInsert)
      .onConflict('id')
      .merge();

    return tx('location_businesses').insert(
      insertedBusinesses.map((business) => ({
        zip_code,
        business_id: business.id,
      }))
    );
  });
};

exports.getBusinessesForLocation = function (zip_code) {
  return db
    .select('*')
    .from('businesses')
    .join('location_businesses', { 'location_businesses.business_id': 'businesses.id' })
    .where('location_businesses.zip_code', zip_code);
};
