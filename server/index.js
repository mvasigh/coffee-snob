require('dotenv').config();

const { createSchema } = require('./db/schema');
const express = require('express');
const cors = require('cors');
const router = require('./router');

const app = express();
const port = 8000;

app
  .use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
  })
  .use(cors())
  .use(express.text())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/api', router);

async function start() {
  await createSchema();

  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
}

start();
