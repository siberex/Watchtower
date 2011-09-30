/**
 * @fileoverview This is Index controller.
 * Here will be album list with covers.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index", "test");


function index(request) {
  var lang = getLang(request);
  var context = {title: "Stepan Legachev salutes you!"};

  return app.render("index.html", context);
} // index