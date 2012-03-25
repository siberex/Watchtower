var db = require('appengine/google/appengine/ext/db');

var Host = exports.Host = db.Model('Host', {
  url     : new db.LinkProperty({required: true}),
  added   : new db.DateTimeProperty({autoNowAdd: true}),
  updated : new db.DateTimeProperty({autoNowAdd: true}),
  status  : new db.IntegerProperty()
// email:
});
