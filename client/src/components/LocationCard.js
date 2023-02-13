import './LocationCard.css';
import { Link } from 'react-router-dom';

export default function LocationCard({ locationName, zipCode, averageRating }) {
  return (
    <div className="LocationCard">
      <Link className="TitleLink" to={`/location/${zipCode}`}>
        <p className="Title">
          {locationName} - {zipCode}
        </p>
      </Link>
      <p>Average rating: {averageRating.toFixed(2)}/5</p>
    </div>
  );
}
