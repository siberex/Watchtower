/**
 * @fileoverview Action (controller-action) list,
 * e.g. main routing configuration.
 *
 */

var {Application} = require("stick");
//var app = exports.app = require("./main").app;
var {app, config} = require("./main");
var adminUrl = "/" + config.general.adminUrl;


// Password protected admin zone.
app.basicauth(adminUrl, config.general.login, config.general.password);

app.get(adminUrl, require("./actions/administrivia").index);



app.get("/sitemap", require("./actions/sitemap").index);

app.get("/rss", require("./actions/rss").index);

app.get("/", require("./actions/index").index);
