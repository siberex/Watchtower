/**
 * @fileoverview This is controller for /sitemap
 *
 */

var {app} = require("../main");
export("index");


function index(request) {
  var context = {};

  return app.render("sitemap.xml", context, {
    contentType: "text/xml",
  });
} // index