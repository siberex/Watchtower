/**
 * @fileoverview Action (controller-action) list,
 * e.g. main routing configuration.
 *
 */

var {Application} = require("stick");
//var app = exports.app = require("./main").app;
var {app} = require("./main");


// Password protected admin zone.
var admin = new Application( require("./act.administrivia").index );
admin.configure("basicauth");
// TODO: Move auth. logins to config.
// Password is “godsexlove”
admin.basicauth("/", "admin", "48B60EB568BC74D1063F1F7FDFB56010E0E206AD");

app.mount("/administrivia", admin);



/*app.get(
  "/administrivia",
  require("./act.administrivia").index
);*/

app.get("/sitemap", require("./act.sitemap").index);

app.get("/rss", require("./act.rss").index);

app.get("/", require("./act.index").index);
