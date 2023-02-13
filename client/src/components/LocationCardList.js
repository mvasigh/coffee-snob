import './LocationCardList.css';

import { LocationCard } from '../components';

export default function LocationCardList({ locations = [] }) {
  return (
    <ul className="LocationCardList">
      {locations.map(({ location_name, zip_code, average_rating }) => (
        <li key={zip_code}>
          <LocationCard
            locationName={location_name}
            zipCode={zip_code}
            averageRating={average_rating}
          />
        </li>
      ))}
    </ul>
  );
}
