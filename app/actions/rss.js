/**
 * @fileoverview This is controller for /rss
 *
 */

var {app} = require("../main");

export("index");

function index(request) {
  var context = {};

  return app.render("rss.xml", context, {
    contentType: "text/xml",
  });
} // index