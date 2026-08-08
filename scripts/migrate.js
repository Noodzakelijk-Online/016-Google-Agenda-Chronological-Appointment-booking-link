'use strict';

const { loadConfig } = require('../src/config');
const { openDatabase } = require('../src/db');
const config = loadConfig();
const db = openDatabase(config);
const migrations = db.prepare('SELECT version, applied_at FROM schema_migrations ORDER BY version').all();
console.log(JSON.stringify({ databasePath: config.databasePath, migrations }, null, 2));
db.close();
