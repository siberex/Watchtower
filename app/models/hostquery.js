var db = require('appengine/google/appengine/ext/db');
var {Host} = require('models/host');

var HostQuery = exports.HostQuery = db.Model('HostQuery', {
  // @deprecated In favor of parent usage.
  // host      : new db.ReferenceProperty({referenceClass: Host, required: true}),
  executed  : new db.DateTimeProperty({autoNowAdd: true}),
  status    : new db.IntegerProperty(),
  time      : new db.FloatProperty()
});