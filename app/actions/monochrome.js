/**
 * @fileoverview Monochrome bookmarklet page.
 *
 */

var {app, config} = require("../main");
export("index");


function index(request) {
  var context = {
    title   : "Monochrome will change the world",
    head    : '<link rel="stylesheet" href="/css/monochrome/jquery-ui-1.8.16.custom.css" type="text/css" />' + "\n"
            + '<link rel="stylesheet" href="/css/monochrome.css" type="text/css" />' + "\n"
            + '<script type="text/javascript" charset="UTF-8" src="/js/jquery-ui-1.8.16.custom.js"></script>' + "\n"
            + '<script type="text/javascript" charset="UTF-8" src="/js/monochrome.js?nocache=1"></script>' + "\n"
            + '<script type="text/javascript" charset="UTF-8" src="/js/monochrome-ui.js"></script>',
    baseUrl : request.headers.host ? "http://" + request.headers.host : config.general.baseUrl
  };
  return app.render("monochrome.html", context);
} // index
