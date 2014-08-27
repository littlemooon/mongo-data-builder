'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    _ = require('lodash'),
    propertyService = require('../services/property-service');

// ROUTES

exports.init = function (app) {
  app.use(route.get('/api/properties', listProperties));
  app.use(route.post('/api/properties', createProperty));
  app.use(route.put('/api/properties/:id', updateProperty));
  app.use(route.del('/api/properties/:id', deleteProperty));
};

// ROUTE FUNCTIONS

function *listProperties() {
  // get properties
  var properties = yield propertyService.getProperties();

  // return
  this.body = properties;
}

function *createProperty() {
  // get new property
  var property = yield parse(this);
  property.createdTime = new Date();

  // create record
  var results = yield propertyService.createProperty(property);
  
  // return
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *updateProperty(id) {
  // get property to update
  var property = yield parse(this);
  property = {
    updatedTime: new Date(), 
    name: property.name,
    next: property.next,
    prev: property.prev
  };

  // update record
  yield propertyService.updateProperty(id, property);

  // return
  this.status = 201;
}

function *deleteProperty(id) {
  // set property to inactive
  yield propertyService.deleteProperty(id);

  // return
  this.status = 201;
}