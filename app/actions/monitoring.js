/**
 * @fileoverview This is Monitoring controller.
 * Sites for monitoring defined in app/config/monitoring.cfg
 *
 */

var system = require('system');

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
    head      : '<link rel="stylesheet" href="/css/addhost.css" />',
    title     : title,
    lang      : lang,
    header    : (lang == "ru") ? "Добавление сайта в систему мониторинга" : "Add host for monitoring",
    submit    : (lang == "ru") ? "Добавить" : "Add",
    placeholder: (lang == "ru") ? "Адрес сайта, например http://ya.ru" : "Enter URL, for example http://google.com"    
  };

  
  if (request.method == "POST" && request.params.url) {
    var host = request.params.url;
    var error = false;

    // In case of error let’s save input value to display it back in form input.
    context.value = host;

    // Check for "http(s)://" at the beginning:
    var href = (/^https?:\/\//).test(host) ? host : "http://" + host;
    
    
    if (!request.session.data.init) {
      // No session (e.g. direct POST from bot or browser not supporting session headers)
      // or more than 30 minutes left since page load (session was destroyed).

      error = (lang == "ru")
            ? "Время сессии пользователя по какой-то причине истекло. Пожалуйста, попробуйте добавить сайт снова."
            : "Session is expired for some obscure reason. Please try to add this site again.";
      //throw new Error("Session expired");
    } else {
      // Check time difference between now and time saved in session on form render,
      // if it is too small, probably this is a crawler or bot.

      // Ping host to check URL is correct and site available.
      var Pinger = new Packages.sibli.Pinger();
      var status = Pinger.ping(href);

      if (status == "Malformed URL" || status == "URL is null") {
        error = (lang == "ru")
              ? "Указан некорректный адрес сайта. Проверьте адрес и попробуйте добавить сайт снова."
              : "There is error in URL. Please check the link address and click on submit again.";
      } else if (status == "Timeout" || status == "Host unreachable") {
        error = (lang == "ru")
              ? "Не удалось получить ответ от сайта. Если сайт сейчас перегружен и отвечает медленно, попробуйте снова через пару минут. Или, возможно, в адресе сайта ошибка."
              : "Could not get answer from site. If your site is overloaded now, please try to add it again a bit later. Besides, may be there is error in URL.";
      } else {
        var {Host} = require('models/host');

        /**
         * We need to check host for existance in DB.
         * We don’t want to create tons of hosts with identical URL.
         * If host exists, let’s update time added. 
         */
        var hostObj = new Host({
          url: href
        }, href);
        hostObj.put();
        var success = true;
      }

    }

    context.test = error ? error : status;
    request.session.data.init = (new Date()).toString();
  } else {
    /**
     * http://code.google.com/intl/en/appengine/docs/java/config/appconfig.html
     * > Because App Engine stores session data in the datastore and memcache, all values
     * > stored in the session must implement the java.io.Serializable interface.
     * So we can not use Date directly and must convert such values to strings.
     */
    request.session.data.init = (new Date()).toString();
  }

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