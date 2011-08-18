var db = require('google/appengine/ext/db');

var File = exports.File = db.Model('File', {
  src     : new db.LinkProperty({required: true}),
  width   : new db.IntegerProperty(),
  height  : new db.IntegerProperty(),
  Exif    : new db.TextProperty() // It will be JSON.
					  // In future — something to implement Exif tags and filtering by Exif.
});
