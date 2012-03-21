/**
 * @fileoverview This is Monitoring controller.
 * Sites for monitoring defined in app/config/monitoring.cfg
 *
 */

var {app} = require("../main");
var {getLang} = require("../helpers");
export("index", "async", "addhost");


function index(request) {
  var lang = getLang(request);
  var title = (lang == "ru")
            ? "Мониторинг"
            : "Monitoring";

  var Pinger = new Packages.sibli.Pinger();
  // Let’s use reflection, just to play with Java:
  // var clsPinger = java.lang.Class.forName("sibli.Pinger");
  // var Pinger = clsPinger.newInstance();

  //var Logger = new Packages.org.apache.log4j.Logger.getLogger();
  //var Logger = org.apache.log4j.Logger.getLogger();
  var log = require("ringo/logging").getLogger(module.id);
  log.info("Hello {}", "----------------------");

  var sources = getSources();

  //var tStart = +new Date();
  var tStart = new Date().getTime();
  var cStart, cEnd;
  for each (var host in sources) {
    try {
      // Using reflection:
      // status = clsPinger.getMethod("ping", java.lang.String).invoke( Pinger, href );
      // Normal way:
      cStart = new Date().getTime();
      host.status = Pinger.ping(host.href);
      //cEnd = new Date().getTime();
      host.time = (new Date().getTime() - cStart) / 1000.0;
    } catch (e) {
      // This will never happen, 
      // all exceptions caught in Pinger.
      host.status = "err";
    }
  }
  //var tEnd = +new Date();
  var tEnd = new Date().getTime();

  var context = {
    title   : title,
    lang    : lang,
    time    : ((tEnd - tStart) / 1000.0).toString(),
    sources : sources
  }

  return app.render("monitoring.html", context);
} // index


function async(request) {
  var lang = getLang(request);
  var title = (lang == "ru")
            ? "Мониторинг"
            : "Monitoring";

  //var sources = getSources();
  var PingerAsync = new Packages.sibli.PingerAsync();
  var sources = PingerAsync.getSources();
  var test = PingerAsync.ping(sources);

  var context = {
    title : title,
    lang  : lang,
    test  : uneval(test),
    head  : app.renderPart("asyncmon-header.html", {
                sources : uneval(test)
            })
  };

  return app.render("asyncmon.html", context);
} // async


function addhost(request) {
  var lang = getLang(request);
  var title = (lang == "ru")
            ? "Мониторинг сайта — Добавление адреса"
            : "Site monitoring — Host add";

  var context = {
    title : title,
    lang  : lang,
    header: (lang == "ru") ? "Добавление сайта в систему мониторинга" : "Add host for monitoring",
    submit: (lang == "ru") ? "Добавить" : "Add",
    placeholder: (lang == "ru") ? "Адрес сайта, например http://ya.ru" : "Enter URL, for example http://google.com"
    
  };

  if (request.method == "POST" && request.params.url) {
    var host = request.params.url;

    // if error
    context.value = host;

  } else {
    request.session.data.init = new Date();

  }
  context.debug = uneval(request.method);
  return app.render("addhost.html", context);
} // addhost


/**
 * Returns hosts list from app/config/monitoring.cfg
 * Uses Java to access config file.
 *
 * @return {Array} Hosts.
 */
function getSources() {
  var sources = [];

  var fstream = new java.io.FileInputStream("app/config/monitoring.cfg");
  var input = new java.io.DataInputStream(fstream);
  var bufferReader = new java.io.BufferedReader( new java.io.InputStreamReader(input) );
  var readLine, parsedLine, parsedUrl,
      href, host, html;

  while ( (readLine = bufferReader.readLine()) != null ) {
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

    sources.push({
      href   : href,
      host   : host,
      html   : html
    });
  } // while

  input.close();

  return sources;
} // getSources