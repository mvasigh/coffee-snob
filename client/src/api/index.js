const BASE_URL = 'http://localhost:8000/api';

export function getLocationData(zipCode) {
  return fetch(`${BASE_URL}/location/${zipCode}`).then((res) => res.json());
}

export function getAllLocationData() {
  return fetch(`${BASE_URL}/location`).then((res) => res.json());
}
