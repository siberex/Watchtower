/**
 * @fileoverview This is Index controller.
 * Here will be album list with covers.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index", "test");

function test(request) {

  var context = {
    lang    : getLang(request)
  };
  return app.render("test.html", context);
} // test

function index(request) {
  var context = {title: "Stepan Legachev salutes you!"};

  return app.render("index.html", context);
} // index