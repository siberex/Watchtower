#!/usr/bin/env ringo

var {Application} = require("stick"),
    {Server} = require("ringo/httpserver"),
    {Buffer} = require("ringo/buffer"),
    log = require("ringo/logging").getLogger("CryingBanksy");


// Application init.
var app = exports.app = Application();

// Configure notfound, mount, and static middleware.
app.configure("notfound", "error", "params", "basicauth", "mount", "route");

// We are aiming on AppEngine, where we have no access to FS
// and static files are maintained by AppEngine itself.
//app.static( module.resolve("../pub") );

app.mount( "/", require("./actions") );




// Start server if run as main script from ringo.
// I hope no one will deploy it this way. Please use AppEngine instead.
if (require.main === module) {
  require("ringo/httpserver").main(module.id);
}
