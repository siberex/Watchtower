/**
 * @fileoverview This is controller for /administrivia
 *
 */

var {app} = require("./main");

export("index");

function index(request) {
  var context = {title: "Administrivia"};
  return app.render("administrivia.html", context);
} // index