/**
 * @fileoverview This is Index controller.
 * Main pages just as is.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index", "mobile", "test");


function index(request) {
  var lang = getLang(request);
  lang = "en"; ////////// HARDCODE //////////

  var title = (lang == "ru")
            ? "Степан Легачёв. Говорит и показывает"
            : "Stephan Legachev online";


  var context = {
    title : title,
    lang  : lang,
    head  : app.renderPart("index-header.html"),
    bodyclass: 'vcard',
    baseUrl : request.headers.host ? "http://" + request.headers.host : config.general.baseUrl,
    text  : app.renderPart("index-text." + lang + ".html")
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
    lang  : lang,
    bodyclass: 'mobile vcard',
    head  : '<link rel="stylesheet" href="/css/mobile.css" type="text/css" />'
  };

  return app.render("mobile.html", context);
} // mobile




function test(request) {
  var test = "———";

  var context = {
    test : test
  }

  return app.render("test.html", context);
} // test