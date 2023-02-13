const TEST_BUSINESSES = Array.from({ length: 5 }, (_, i) => ({
  id: i.toString(),
  name: `Test Business ${i}`,
  rating: 4.5,
  review_count: 10,
}));
const TEST_LOCATION_DATA = {
  location_name: 'Test City',
  average_rating: 3.6,
  businesses: TEST_BUSINESSES,
};

export function getLocationData(zipCode) {
  return Promise.resolve({ ...TEST_LOCATION_DATA, zip_code: zipCode });
}

export function getAllLocationData() {
  return Array.from({ length: 5 }, (_, i) => ({
    ...TEST_LOCATION_DATA,
    zip_code: (11111 + i).toString(),
  }));
}
