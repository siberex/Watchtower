/**
 * @fileoverview This is Index controller.
 * Here will be album list with covers.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index", "mobile");


function index(request) {
  var lang = getLang(request);

  var title = (lang == "ru")
            ? "Степан Легачёв. Говорит и показывает"
            : "Stephan Legachev online";

  var context = {
    title : title,
    lang  : lang
  };

  return app.render("index.html", context);
} // index


function mobile(request) {
  var lang  = getLang(request);

  var title = (lang == "ru")
            ? "Степан Легачёв. Говорит и показывает"
            : "Stephan Legachev online";

  var context = {
    title : title,
    lang  : lang
  };

  return app.render("mobile.html", context);
} // mobile