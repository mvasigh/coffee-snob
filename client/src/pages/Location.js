import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Section, LocationCard, BusinessCard } from '../components';
import * as api from '../api';

export default function Location() {
  const { zipCode } = useParams();
  const locationData = useQuery(`location-${zipCode}`, () => api.getLocationData(zipCode));

  if (locationData.isLoading) return <p>Loading...</p>;

  return (
    <>
      <Section>
        <h3>You searched: {zipCode}</h3>
        <LocationCard
          locationName={locationData.data.location_name}
          zipCode={locationData.data.zip_code}
          averageRating={locationData.data.average_rating}
        />
      </Section>
      <Section>
        <h3>Nearby coffee shops</h3>
        {locationData.data.businesses.map(({ id, name, review_count, rating }) => (
          <BusinessCard key={id} name={name} rating={rating} reviewCount={review_count} />
        ))}
      </Section>
    </>
  );
}
