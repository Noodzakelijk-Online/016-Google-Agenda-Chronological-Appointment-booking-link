'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { loadConfig } = require('../src/config');
const { openDatabase } = require('../src/db');

const config = loadConfig();
const target = path.resolve(process.argv[2] || `./backups/booking-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
fs.mkdirSync(path.dirname(target), { recursive: true });
if (fs.existsSync(target)) throw new Error(`Refusing to overwrite existing backup: ${target}`);
const db = openDatabase(config);
db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
db.close();
console.log(`Backup created: ${target}`);
