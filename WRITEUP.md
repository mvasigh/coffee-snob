# Design discussion for Coffee Snob

The central question that Coffee Snob attempts to answer is:

> Which zip code in the US has the best coffee on average?

The way that Coffee Snob attempts to answer this question is by querying the [Yelp Fusion API](https://docs.developer.yelp.com/docs/fusion-intro) for coffee shops near a user-provided zip code and averaging their ratings. The user can query several zip codes and compare their average ratings in order to demonstrate their location's caffeine drink superiority.

## Database design

Coffee Snob uses an in-memory SQLite database as its data store for convenience and ease of iteration during development, however this could easily be swapped for another SQL database.

The database schema can be found in [`server/db/schema.js`](https://github.com/mvasigh/coffee-snob/blob/main/server/db/schema.js) and comprises of three tables:

- `locations`
- `businesses`
- `location_businesses`

### `locations`

The `locations` table stores records for searched locations (zip codes), including their computed average ratings and last updated timestamps. This data is stored for two purposes:

1. To show the user all previous searches and their average ratings
2. To avoid refetching and recomputing average scores for each location every time

Based on the `last_updated` field, the data backend can choose to invalidate the cached data and query the Yelp API again if the data is deemed too old (for example, more than a day). We can reasonably expect that Yelp ratings will not change dramatically within the cache period.

### `businesses`

Similar to the previous table, the `businesses` table stores detailed information about individual coffee shops provided by the Yelp API. This table uses the `id` provided by Yelp as its primary key meaning that there is one record per business regardless of if the coffee shop is in close proximity to multiple zip codes. 

### `location_businesses`

The `location_businesses` table is a join table that facilitates a many-to-many relationship between `locations` and `businesses`. A single coffee shop can be in close proximity to multiple zip codes, so using a join table allows us to associate a `business` with multiple `locations` in a simple way. A more robust solution may use a spatial database such as [PostGIS](https://postgis.net/) but that is not necessary for a simple use case like this.

## Backend design

The Coffee Snob data backend is a Node.js application that uses Express.js for route handling and Knex as a SQL query builder for interacting with the database. Notable code locations:

- `server/router.js` - Contains all of the routes handled by the application
- `server/yelp.js` - Exports functions for interacting with the Yelp API
- `server/db/query.js` - Exports functions for querying the database

Most of the behavior of the application is contained within the route handlers, in particular the `GET /location/:zip_code` route which performs caching of Yelp data as a side-effect and attempts to return cached data first. This is done to avoid exceeding API limits as well as for improved performance and latency.

To keep the design simple and avoid relying on another API, this route also determines a city name for the provided zip code by identifying the most frequently occurring city name in the addresses of coffee shops returned by Yelp.

I did not have time to write any tests for the backend, but did manually test the backend using Postman and included my Postman collection in the `postman` directory.

### Areas for improvement

- Currently, caching of Yelp data is contained within the side effects of a single route. Introducing a separate caching layer would make behavior consistent across routes (for example, the `GET /businesses/` route will return nothing if data hasn't already been cached using the `GET /locations/:zip_code` route)
- More robust testing, including unit testing of logic and handlers and integration testing for the API and database boundaries.
- More robust error handling and validation (in some cases, database errors are propagated to the frontend)
- A system for safe database schema migrations.

## Frontend design

The Coffee Snob frontend's main user journey is the following:

1. User enters a zip code on the main page and performs a search
2. Application navigates to the results page where the average rating for the user provided zip code as well as names and ratings of indivudal coffee shops 
3. User navigates back to the home page to search again or see all previous searches
4. (Optional) user can click on the location of a previous search to view the results for that location again

The frontend uses React as the UI library, with Open-Props used for styling primitives, React Router used as a routing library, and React Query used as a data fetching library. There are two pages in total, the `Home` page which displays the search form and previous searches, and the `Location` page which displays results for a single zip code.

There are many potential enhancements to the frontend that I did not have time to address; originally, I planned to include filtering options for coffee shops that would allow users to further narrow them down and/or sort them, with state being preserved in the URL for deep-linking, as well as a page that would display data for a single coffee shop. 

### Areas for improvement

- More testing, including testing for edge cases, testing for accessibility, more comprehensive assertions, and unit tests at the component level. I only had time to write a single happy-path test.
- Better error handling. Currently, the frontend does not handle any backend errors gracefully. React Query makes error handling straightforward, so this could easily be done using the messages provided by the backend provided that the backend is sending the correct HTTP status code. Route mismatches are also not being handled, which is easy to do with React Router but I did not get to it.
- Better responsiveness and modularity. There wasn't as much time to focus on modularized UI components since more of the time on this project was spent on the backend, understanding the Yelp API, and designing an appropriate schema. 