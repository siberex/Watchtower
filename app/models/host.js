var db = require('appengine/google/appengine/ext/db');

var Host = exports.Host = db.Model('Host', {
  url     : new db.LinkProperty({required: true}),
  added   : new db.DateTimeProperty({autoNowAdd: true}),
  updated : new db.DateTimeProperty({autoNowAdd: true}),
  status  : new db.IntegerProperty()

  // User’s settings need to be moved to separate wrapper model in future.
  // email: new db.EmailProperty(), 
  // notificationFlags : new db.ListProperty({itemType: db.BooleanProperty})
});
