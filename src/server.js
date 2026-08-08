'use strict';

const http = require('node:http');
const { loadConfig } = require('./config');
const { createVault } = require('./crypto');
const { openDatabase } = require('./db');
const { GoogleCalendarProvider } = require('./google-provider');
const { BookingService } = require('./booking-service');
const { createApp } = require('./app');

function createRuntime(overrides = {}) {
  const config = overrides.config || loadConfig();
  const db = overrides.db || openDatabase(config);
  const vault = overrides.vault || createVault(config.encryptionKey);
  const provider = overrides.provider || new GoogleCalendarProvider({ config, db, vault });
  const service = overrides.service || new BookingService({ config, db, provider, vault });
  return { config, db, vault, provider, service, handler: createApp({ config, service, provider }) };
}

if (require.main === module) {
  const runtime = createRuntime();
  const server = http.createServer(runtime.handler);
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.listen(runtime.config.port, runtime.config.host, () => {
    console.log(`Chronological Booking listening on ${runtime.config.baseUrl}`);
    if (!runtime.config.googleConfigured) console.log('Google Calendar is not configured; booking mutations are disabled.');
  });
  const shutdown = (signal) => {
    console.log(`${signal} received; stopping safely.`);
    server.close(() => { runtime.db.close(); process.exit(0); });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { createRuntime };
