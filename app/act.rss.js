/**
 * @fileoverview This is controller for /rss
 *
 */

var {app} = require("./main");

export("index");

function index(request) {
  var context = {title: "It's working!"};
  return app.render("index.html", context);
} // index