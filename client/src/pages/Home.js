import './Home.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Section, LocationCardList } from '../components';
import * as api from '../api';

export default function Home() {
  const allLocationData = useQuery('locations', () => api.getAllLocationData());
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    navigate(`/location/${zipCode}`);
  };

  return (
    <>
      <Section>
        <h3 className="Headline">So you think you know good coffee?</h3>
        <p className="Description">
          Let's find out how good the coffee around you really is. Enter a zip code to get started!
        </p>
      </Section>

      <Section>
        <form className="Form" onSubmit={handleFormSubmit}>
          <div className="Control">
            <label htmlFor="zip-code">Zip Code</label>
            <input
              id="zip-code"
              name="zip-code"
              type="text"
              autoComplete="postal-code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="\d{5}"
              placeholder="i.e. 30033"
              title="Please enter a 5-digit zip code"
              required
            />
          </div>

          <button>Search</button>
        </form>
      </Section>

      <Section>
        <h4>Previous searches</h4>

        {allLocationData.isLoading && <p>Loading...</p>}
        {!allLocationData.isLoading && allLocationData.data.length ? (
          <LocationCardList locations={allLocationData.data} />
        ) : (
          <p>No search history found.</p>
        )}
      </Section>
    </>
  );
}
