'use strict';

const test=require('node:test'); const assert=require('node:assert/strict'); const {loadConfig}=require('../src/config');
test('requires an explicit strong operator token',()=>{assert.throws(()=>loadConfig({ADMIN_TOKEN:'short',APP_ENV:'test'}),/at least 24/);});
test('production fails closed without HTTPS and encryption',()=>{assert.throws(()=>loadConfig({ADMIN_TOKEN:'a'.repeat(32),APP_ENV:'production',BASE_URL:'http://localhost'}),/ENCRYPTION_KEY|HTTPS/);});
test('Google credentials must be paired',()=>{assert.throws(()=>loadConfig({ADMIN_TOKEN:'a'.repeat(32),APP_ENV:'test',GOOGLE_CLIENT_ID:'client'}),/configured together/);});
