'use strict';

var _ = require('lodash'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.getProperties = getProperties;
module.exports.createProperty = createProperty;
module.exports.updateProperty = updateProperty;
module.exports.deleteProperty = deleteProperty;

// EXPORTED FUNCTIONS

function *getProperties() {
  // get active properties
  var properties = yield mongo.properties.find({"deletedTime": {"$exists": false}}).toArray();
  properties.forEach(function (property) {
    property.id = property._id;
    delete property._id;
  });

  return sortProperties(properties);
}

function *createProperty(property) {
  // get related property
  var prevProperty = yield mongo.properties.findOne({
    "deletedTime": {"$exists": false},
    "next": null
  });

  // create new property record
  property.createdTime = new Date();
  property.prev = prevProperty && prevProperty._id;
  property.next = null;
  var results = yield mongo.properties.insert(property);

  // update related property record
  if (prevProperty) {
    prevProperty.updatedTime = new Date();
    prevProperty.next = property._id;
    yield mongo.properties.update({_id: prevProperty._id}, prevProperty);
  }

  return results;
}

function *updateProperty(id, property) {
  id = ObjectID(id);

  // get property prior to update
  var oldProperty = yield getProperty(id);

  // get related properties
  var nextProperty = yield getProperty(property.next);
  var prevProperty = yield getProperty(property.prev);

  // update property record
  var results = yield mongo.properties.update({_id: id}, property);

  // update related properties
  yield updateRelatedProperty(nextProperty, 'prev', id);
  yield updateRelatedProperty(prevProperty, 'next', id);

  // update old properties
  if (oldProperty) {
    var oldNextProperty = yield getProperty(oldProperty.next);
    yield updateRelatedProperty(oldNextProperty, 'prev', oldProperty.prev);
    var oldPrevProperty = yield getProperty(oldProperty.prev);
    yield updateRelatedProperty(oldPrevProperty, 'next', oldProperty.next);
  }

  return results;
}

function *deleteProperty(id) {
  id = ObjectID(id);

  // get property prior to update
  var oldProperty = yield getProperty(id);

  // get related properties
  var nextProperty = yield getProperty(oldProperty.next);
  var prevProperty = yield getProperty(oldProperty.prev);

  // set property to inactive
  var results = yield mongo.properties.update({_id: id}, {$set: {
    deletedTime: new Date(),
    next: null,
    prev: null
  }});
  
  // update related properties
  yield updateRelatedProperty(nextProperty, 'prev', prevProperty && prevProperty._id);
  yield updateRelatedProperty(prevProperty, 'next', nextProperty && nextProperty._id);

  return results;
}

// FUNCTIONS

function sortProperties(properties) {
  if (properties.length === 0) return [];

  // transform properties to expose id
  var propertiesById = _.reduce(properties, function(propertiesById, property) {
    propertiesById[property.id] = property;
    return propertiesById;
  }, {});

  // add first property
  var sortedProperties = [
    _.filter(properties, function(property) {
      return !property.prev;
    })[0]
  ];

  // add each property that matches the previous property's 'next'
  for (var i = 0; i < properties.length-1; i++) {
    sortedProperties.push(propertiesById[sortedProperties[sortedProperties.length-1].next.toString()]);
  }
  return sortedProperties;
}

function *getProperty(id) {
  return yield mongo.properties.findOne({
    "deletedTime": {"$exists": false},
    "_id": id
  });
}

function *updateRelatedProperty(relatedProperty, property, id) {
  if (relatedProperty && relatedProperty[property] !== id) {
    relatedProperty.updatedTime = new Date();
    relatedProperty[property] = id;
    return yield mongo.properties.update({_id: relatedProperty._id}, relatedProperty);
  }
}

function *updateEntries(changes) {
  for (var categoryId in changes) {

    // update entries for each category id
    console.log(changes[categoryId].length + ' records changing to ' + categoryId);
    yield mongo.entries.update({_id: {$in:changes[categoryId]}}, {$set: {
      categoryId: categoryId,
      updatedTime: new Date()
    }}, {multi: true});
  }
}