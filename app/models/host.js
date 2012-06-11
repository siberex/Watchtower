var db = require('appengine/google/appengine/ext/db');

var Host = exports.Host = db.Model('Host', {
  url       : new db.LinkProperty(    {required: true}),
  finalurl  : new db.LinkProperty(    {defaultValue: null} ),
  domain    : new db.StringProperty(  {defaultValue: null} ),
  added     : new db.DateTimeProperty({autoNowAdd: true, indexed: false}),
  updated   : new db.DateTimeProperty({autoNowAdd: true, indexed: false}), // NEW: unindexed
  status    : new db.IntegerProperty( {required: true}),
  viewed    : new db.DateTimeProperty({autoNowAdd: true}),
  views     : new db.IntegerProperty( {defaultValue: 0} ),
  useget    : new db.BooleanProperty( {defaultValue: false, indexed: false} ) // Use GET method instead of HEAD
});
