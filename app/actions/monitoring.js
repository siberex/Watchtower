/**
 * @fileoverview This is Monitoring controller.
 * Sites for monitoring defined in app/config/monitoring.cfg
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index");


function index(request) {
  var sources = [];

  var Pinger = new Packages.sibli.Pinger();
  // Let’s use reflection, just to play with Java:
  // var clsPinger = java.lang.Class.forName("sibli.Pinger");
  // var Pinger = clsPinger.newInstance();

  var fstream = new java.io.FileInputStream("app/config/monitoring.cfg");
  var input = new java.io.DataInputStream(fstream);
  var bufferReader = new java.io.BufferedReader( new java.io.InputStreamReader(input) );
  var readLine, parsedLine, parsedUrl,
      href, status, host, html;

  while ( (readLine = bufferReader.readLine()) != null )   {
    if (readLine.trim().length == 0)
      continue;

    parsedLine = readLine.split("\t");
    href = parsedLine[0].trim();
    if (href.length == 0)
      continue;

    html = (parsedLine.length < 2) ? "" : parsedLine[1].trim();

    parsedUrl = href.match(/^(?:(https?|ftp):\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)?(.*?)?(?:(\w+\.\w+)([^.]*))?$/);
    if (!parsedUrl[0] || !parsedUrl[2])
      continue;

    host = parsedUrl[2];

    try {
      // Using reflection:
      // status = clsPinger.getMethod("ping", java.lang.String).invoke( Pinger, href );
      // Normal way:
      status = Pinger.ping(href);
    } catch (e) {
      status = "err";
    }

    sources.push({
      href   : href,
      host   : host,
      html   : html,
      status : status
    });
  } // while
  input.close();


  var context = {
    sources: sources
  }

  return app.render("monitoring.html", context);
} // index