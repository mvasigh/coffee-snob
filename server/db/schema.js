const db = require('./db');

exports.createSchema = async function () {
  /**
   * Stores the locations from searches performed by the user
   * along with aggregate data relating to that location
   */
  await db.schema.createTable('locations', (table) => {
    table.string('zip_code').primary();
    table.timestamp('last_updated').defaultTo(db.fn.now());
    table.timestamp('location_name').defaultTo('Unknown location');
    table.float('average_rating').notNullable();
  });

  /**
   * Stores information for individual businesses, including their
   * ratings and review counts
   */
  await db.schema.createTable('businesses', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.integer('rating').notNullable();
    table.integer('review_count').notNullable();
  });

  /** Maps location zip codes to businesses that exist in that zip code */
  await db.schema.createTable('location_businesses', (table) => {
    table.string('zip_code').references('zip_code').inTable('locations').notNullable();
    table.string('business_id').references('id').inTable('businesses').notNullable();
  });
};
