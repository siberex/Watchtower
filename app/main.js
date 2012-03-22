#!/usr/bin/env ringo

var {Application} = require("stick"),
    {Server} = require("ringo/httpserver"),
    {Buffer} = require("ringo/buffer"),
    log = require("ringo/logging").getLogger("CryingBanksy");


// Application init.
var app = exports.app = Application();
var config = exports.config = require('./config');


// Configure middleware.
//app.configure("session", "basicauth", "cookies", "params", "error", "notfound", "route", "mount", "render");
app.configure("session", "basicauth", "cookies", "notfound", "error", "params", "route", "mount", "render");

app.error.template = module.resolve("views/500.html");
app.notfound.template = module.resolve("views/404.html");

// Configure render module.
app.render.base         = module.resolve("views");
app.render.contentType  = "text/html";
app.render.charset      = "UTF-8";
app.render.master       = "base.html";
app.render.helpers      = require("./helpers");


// We are aiming on AppEngine, where static files are maintained by GAE itself,
// but let add evnvironement for other deployment configurations too.
var jsgi = app.env("jsgi");
jsgi.configure("static");
jsgi.static( module.resolve("../pub") );


var actions = require("./actions");


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


//app.error.location = false;

// Start server if run as main script from ringo.
// I hope no one will deploy it this way. Please use AppEngine instead.
if (require.main === module) {
  require("ringo/httpserver").main(module.id);
}
