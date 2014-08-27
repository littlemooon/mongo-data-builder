'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    entryService = require('../services/entry-service'),
    propertyService = require('../services/property-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/entries', listEntries));
  app.use(route.post('/api/entries', createEntry));
  app.use(route.put('/api/entries/:id', updateEntry));
  app.use(route.del('/api/entries/:id', deleteEntry));
};

// ROUTE FUNCTIONS

function *listEntries() {
  // get entries
  var entries = yield entryService.getEntries();

  // return
  this.body = entries;
}

function *createEntry() {
  // get new entry
  var entry = yield parse(this);
  entry.createdTime = new Date();

  // create record
  var results = yield entryService.createEntry(entry);
  
  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateEntry(id) {
  var properties = yield propertyService.getProperties();

  // get entry to update
  var entry = yield parse(this);
  var updatedEntry = {
    updatedTime: new Date()
  };
  properties.forEach(function (property) {
    updatedEntry[property.name] = entry[property.name];
  });

  // update record
  yield entryService.updateEntry(id, updatedEntry);

  // return
  this.status = 201;
}

function *deleteEntry(id) {
  // set entry to inactive
  yield entryService.deleteEntry(id);

  // return
  this.status = 201;
}