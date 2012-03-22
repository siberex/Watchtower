var db = require('google/appengine/ext/db');
//var datastore = require('appengine/lib/google/appengine/api/datastore.js');
//var db = require('appengine/lib/google/appengine/ext/db.js');
//var db = require('google/appengine/ext/db.js');
//var dbP = module.resolve("../packages/appengine/lib/google/appengine/ext/db");
//var dp = require(dbP);

var Host = exports.Host = db.Model('Host', {
  url     : new db.LinkProperty({required: true}),
  added   : new db.DateTimeProperty({autoNowAdd: true})
});
