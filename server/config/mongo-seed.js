'use strict';

var mongo = require('./mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports = function *(overwrite) {
  var count = yield mongo.entries.count({}, {limit: 1});
  if (overwrite || count === 0) {

    // clear database
    for (var collection in mongo) {
      if (mongo[collection].drop) {
        try {
          yield mongo[collection].drop();
        } catch (err) {
          if (err.message !== 'ns not found') { // indicates 'collection not found' error in mongo which is ok
            throw err;
          }
        }
      }
    }

    // populate with seed data
    yield mongo.properties.insert(properties);
  }
};

// SEED DATA

var properties = [
  {
    name: 'Column 1'
  },
  {
    name: 'Column 2'
  }
];