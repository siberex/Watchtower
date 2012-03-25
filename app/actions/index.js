/**
 * @fileoverview This is Index controller.
 * Main pages just as is.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("test");


function index(request) {

} // index



function test(request) {
  var test = "———";

  var context = {
    test : test
  }

  throw new Error("Absolutely unexpected error!");
  return app.render("test.html", context);
} // test