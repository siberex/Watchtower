/**
 * @fileoverview Pacman — A* search AI algorithm demonstration.
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index");


function index(request) {
  var lang = getLang(request);
  var title = (lang == "ru")
            ? "Алгоритм поиска A*"
            : "A* search algorithm";


  var context = {
    title     : title,
    lang      : lang,
    head      : '<link rel="stylesheet" href="/css/ui-darkness/jquery-ui-1.8.11.custom.css" />'
	            + '<link rel="stylesheet" href="/css/pacman.css" />'

              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/arrayhelpers.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/binaryheap.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/graph.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/astar.js"></script>'

              + '<script type="text/javascript" charset="UTF-8" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/jquery-ui-1.8.11.custom.min.js"></script>' // Core, Widget, Button

              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/ui/asearch.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/ui/draw.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/ui/walls.js"></script>'
              + '<script type="text/javascript" charset="UTF-8" src="/js/pacman/ui/ui.js"></script>'
  };

  return app.render("pacman.html", context);
} // index