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
  var test = "OK";

  var log = require("ringo/logging").getLogger(module.id);

  var {Host} = require('models/host');
  var h, parsedUrl;
  var allhosts = Host.all().fetch(1000);

  var urlMatchRe = /^(?:(https?|ftp):\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)?(.*?)?(?:(\w+\.\w+)([^.]*))?$/;

  for (var i in allhosts) {
    h = allhosts[i];

    parsedUrl = h.url.match(urlMatchRe);
    if (!parsedUrl[0] || !parsedUrl[2])
      continue;

    h.domain = parsedUrl[2];

    log.info( h.domain, h.url );

    h.put();
  }

  var context = {
    title  : "TEST",
    test   : test
  }

  //throw new Error("Absolutely unexpected error!");
  return app.render("test.html", context);
} // test