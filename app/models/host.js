var db = require('appengine/google/appengine/ext/db');

var Host = exports.Host = db.Model('Host', {
  url       : new db.LinkProperty({required: true}),
  finalurl  : new db.LinkProperty( {DEFAULT: null} ),
  domain    : new db.StringProperty( {DEFAULT: null} ),
  added     : new db.DateTimeProperty({autoNowAdd: true}),
  updated   : new db.DateTimeProperty({autoNowAdd: true}),
  status    : new db.IntegerProperty()
});
