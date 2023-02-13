# Coffee Snob

Coffee Snob is an application that uses the Yelp Fusion API to aggregate reviews for coffee shops within close proximity to a user-provided zip code, allowing the user to compare the quality of nearby coffee between various locations. It is comprised of two parts, a Node.js backend that uses an in-memory SQLite database for storage, and a React single-page application frontend that communicates with the data backend. 

## Code locations

All of the source code for the data backend is located in the `server` directory, and all of the code for the React frontend is located in thr `client` directory. A [Postman](https://www.postman.com/) collection with exmaple requests for the data backend is located in the `postman` directory. 

## Getting started

It is recommended that you use Node.js v18.0+ to run this application as it was not tested with earlier versions.

To run Coffee Snob in a local development environment, first clone the repository to your local machine using the following command:

```sh
$ git clone https://github.com/mvasigh/coffee-snob.git
```

### Installing dependencies

Coffee Snob uses `npm` for dependency management for both the backend and the frontend, but you can choose to use an alternative like `yarn` or `pnpm` if you wish. Navigate to the directory where you've cloned the repository and run the following commands:

```sh
npm install # install server dependencies
cd ./client
npm install # install client dependencies
cd ..
```

### Configuring secrets

Coffee Snob stores API keys in environment variables. To configure your local environment, create a new file in the root directory of the project called `.env` and copy the contents of `.env.example` into the file. 

You must provide a valid Yelp API key as the value of the `YELP_API_KEY` environment variable for the application to function correctly. You can generate a new API key at https://www.yelp.com/developers/v3/manage_app.

### Starting the development server

From the root directory of the project, run the `npm start` command to start both the backend and frontend development servers. The backend will be served from port `8000` and the frontend from port `3000`. 