const path = require('path');
const { loadEnv } = require('../common/config/env');
const { getDatabaseConfig } = require('../common/config/db.config');
const DatabaseClient = require('../db/sql/db.client');

loadEnv();

const config = getDatabaseConfig({
  storage: process.env.DB_STORAGE || path.join(process.cwd(), 'smeta.db'),
});

const client = new DatabaseClient(config);

client
  .connect()
  .then((connected) => {
    console.log('DB connected:', connected, `(${config.dialect})`);
    process.exit(connected ? 0 : 1);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
