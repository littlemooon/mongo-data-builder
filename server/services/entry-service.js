'use strict';

var mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// EXPORTS

module.exports.getEntries = getEntries;
module.exports.createEntry = createEntry;
module.exports.updateEntry = updateEntry;
module.exports.deleteEntry = deleteEntry;

// EXPORTED FUNCTIONS

function *getEntries() {
  var entries = yield mongo.entries.find({"deletedTime": {"$exists": false}}).sort({property1: 1}).toArray();
  entries.forEach(function (entry) {
    entry.id = entry._id;
    delete entry._id;
  });

  return entries;
}

function *createEntry(entry) {
  return yield mongo.entries.insert(entry);
}

function *updateEntry(id, entry) {
  return yield mongo.entries.update({_id: ObjectID(id)}, entry);
}

function *deleteEntry(id) {
  return yield mongo.entries.update({_id: ObjectID(id)}, {$set: {deletedTime: Date()}});
}