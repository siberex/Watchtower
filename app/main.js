#!/usr/bin/env ringo

var {Application} = require("stick"),
    {Server} = require("ringo/httpserver"),
    {Buffer} = require("ringo/buffer"),
    log = require("ringo/logging").getLogger("CryingBanksy");


// Application init.
var app = exports.app = Application();
var config = exports.config = require('./config');
//export("app");

// Configure middleware.
app.configure("basicauth", "cookies", "params", "notfound", "error",  "mount", "render",  "route");

app.error.template = module.resolve("views/500.html");
app.notfound.template = module.resolve("views/404.html");

// Configure middleware render module.
app.render.base         = module.resolve("views");
app.render.contentType  = "text/html";
app.render.charset      = "UTF-8";
app.render.master       = "base.html";
app.render.helpers      = require("./helpers");

// We are aiming on AppEngine, where we have no access to FS
// and static files are maintained by AppEngine itself.
//app.static( module.resolve("../pub") );


require("./actions");


// production environment, run with RINGO_ENV=production ringo demo.js
var prod = app.env("production");
prod.configure("gzip", "etag", "error");
prod.error.location = false; // disable error location and stack traces

// development environment, run with RINGO_ENV=development ringo demo.js
var dev = app.env("development").configure("requestlog", "error");
dev.requestlog.append = true;

// profiler environment, run with RINGO_ENV=profiler ringo -o-1 demo.js
var prof = app.env("profiler").configure("requestlog", "profiler", "error");
prof.requestlog.append = true;




// Start server if run as main script from ringo.
// I hope no one will deploy it this way. Please use AppEngine instead.
if (require.main === module) {
  require("ringo/httpserver").main(module.id);
}
