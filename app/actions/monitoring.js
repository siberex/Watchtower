/**
 * @fileoverview This is Monitoring controller.
 * Sites for monitoring defined in app/config/monitoring.cfg
 *
 */

var system = require('system');

var {app, config} = require("../main");
var {getLang} = require("../helpers");
export("index", "getdata", "addhost", "viewhost");

/**
 * @todo This is old stuff, to be deprecated.
 * Java in JS reflection usage examples.
 */
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


/**
 * @param Object Static hash for error messages.
 */
var addhostErrorCodes = {
  "ru": {
    0: "Неизвестная ошибка",
    100: "Время сессии пользователя по какой-то причине истекло. Пожалуйста, попробуйте добавить сайт снова.",
    200: "Указан некорректный адрес сайта. Пожалуйста, проверьте адрес и попробуйте добавить сайт снова.",
    300: "Не удалось получить ответ от сайта. Если сайт сейчас перегружен и отвечает медленно, попробуйте снова через пару минут. �?ли, возможно, в адресе сайта ошибка.",
    400: "Указан пустой адрес сайта. Пожалуйста, введите адрес сайта для добавления в систему мониторинга."
    // ,500: "" //,
  },
  "en": {
    0: "Unknown error",
    100: "Session is expired for some obscure reason. Please try to add this site again.",
    200: "There is error in URL. Please check the link address and click on submit again.",
    300: "Could not get answer from site. If your site is overloaded now, please try to add it again a bit later. Besides, it may be there is error in URL.",
    400: "Empty URL address provided. Please type in URL of the site you want to add to monitoring."
    // ,500: "" //,
  }
} // addhostErrorCodes var

function addhostError(errorCode, context, req) {
  if (context.lang != "ru") context.lang = "en";
  if (!addhostErrorCodes[context.lang][errorCode]) {
    //throw new Error("Unknown error");
    context.error = addhostErrorCodes[context.lang][0]; 
  } else {
    context.error = addhostErrorCodes[context.lang][errorCode];
  }
  return app.render("addhost.html", context);
}

function addhostSuccess(urlKey, context, req) {
  if (context.lang != "ru") context.lang = "en";
  context.urlkey = urlKey;
  context.header = (context.lang == "ru")
                 ? "Сайт успешно добавлен в мониторинг"
                 : "Host has been successfully added";

  context.msg1 = (context.lang == "ru")
               ? "Ссылка на страницу мониторинга для сайта"
               : "Link to the monitoring page for site";

  context.msg2 = (context.lang == "ru")
               ? "Первые результаты мониторинга будут доступны примерно через час."
               : "Note that first results will be available after about an hour.";

  return app.render("addhost.html", context);
}


/**
 * Adding host to queue, Wachtower main page action.
 */
function addhost(request) {
  var lang = getLang(request);
  var context = {
    head      : '<link rel="stylesheet" href="/css/addhost.css" />',
    lang      : lang,
    title     : (lang == "ru") ? "Мониторинг сайта — Добавление адреса"
                               : "Site monitoring — Host add",
    header    : (lang == "ru") ? "Добавление сайта в систему мониторинга"
                               : "Add host for monitoring",
    submit    : (lang == "ru") ? "Добавить"
                               : "Add",
    placeholder: (lang == "ru") ? "Адрес сайта, например http://ya.ru"
                                : "Enter URL, for example http://google.com",
    baseUrl   : request.headers.host ? "http://" + request.headers.host : config.general.baseUrl
  };

  
  if (request.method == "POST") {
    if (!request.params.url || !request.params.url.length) {
      return addhostError(400, context, request);
    }
    var host = request.params.url.trim();

    // In case of error let’s save input value to display it back in form input.
    context.value = host;
    
    if (!request.session.data.init) {
      // No session (e.g. direct POST from bot or browser not supporting session headers)
      // or more than 30 minutes left since page load (session was destroyed).

      return addhostError(100, context, request);
    }
    /**
     * @todo: Check time difference between now and time saved in session on form render.
     *        If time is too small, probably this is a crawler or bot.
     */

    request.session.data.init = (new Date()).toString();

    // Check for "http(s)://" at the beginning and add if there is no "http://" in URL:
    var href = (/^https?|ftp:\/\//).test(host) ? host : "http://" + host;
    
    var parsedUrl = href.match(/^(?:(https?|ftp):\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)?(.*?)?(?:(\w+\.\w+)([^.]*))?$/);
    if (!parsedUrl[0] || !parsedUrl[2]) {
      return addhostError(200, context, request);
    }
    var domain = parsedUrl[2];

    var {Host} = require('models/host');

    /**
     * We need to check host for existance in DB.
     * We don’t want to create tons of hosts with identical URL.
     * If host exists, let’s update its time updated. 
     */
    var existingHost = Host.all().filter("url =", href).fetch(1);
    if (existingHost && existingHost[0]) {
      var key =  existingHost[0].key();
      existingHost[0].updated = new Date();
      existingHost[0].put();
      context.existing = true;
      return addhostSuccess(key, context, request);
    }

    // Ping host to check URL is correct and site available.
    var Pinger = new Packages.sibli.Pinger();
    var status = Pinger.ping(href);
    // @todo: Add new status and timing saving for existing host too.
    // @todo: Add timing, e.g. creation of first HostQueue entity for host.

    if (status == "Malformed URL" || status == "URL is null") {
      return addhostError(200, context, request);
    }
    if (status == "Timeout" || status == "Host unreachable") {
      return addhostError(300, context, request);
    }

    var newHost = new Host({
      //keyName : href,
      url     : href,
      domain  : domain,
      finalurl : null,
      status  : parseInt(status)
    });
    newHost.put();
    var key = newHost.key();
    return addhostSuccess(key, context, request);
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
 * Page for viewing monitoring statistics.
 */
function viewhost(request, key) {
  var lang = getLang(request);
  var context = {
    title   : (lang == "ru") ? "Результаты мониторинга" : "Monitoring statistics",
    head    : app.renderPart("viewhost-header.html", context),
    lang    : lang,
    baseUrl : request.headers.host ? "http://" + request.headers.host : config.general.baseUrl
  }
  context.header = context.title;

  if (!key) {
    context.error = (lang == "ru")
                  ? "Ключ сайта не задан. Чтобы добавить сайт в&nbsp;систему мониторинга и&nbsp;получить ссылку с&nbsp;ключом, перейдите на&nbsp;<a href=\"/addhost\">страницу добавления сайта</a>."
                  : "Monitored host key was not provided. You can add your site to monitoring system and get link with host key on <a href=\"/addhost\">this page</a>.";
    context.head = app.renderPart("viewhost-header.html", context);
    return app.render("viewhost.html", context);
  }
  
  var {Host} = require('models/host');
  var h = null;
  try {
    h = Host.get(key);
  } catch (e) {
    h = null;
  }

  if (!h) {
    context.error = (lang == "ru")
                  ? "Ключ сайта не найден в базе. Чтобы добавить сайт в&nbsp;систему мониторинга и&nbsp;получить ссылку с&nbsp;ключом, перейдите на&nbsp;<a href=\"/addhost\">страницу добавления сайта</a>."
                  : "Provided host key not found. You can add your site to monitoring system and get link with host key on <a href=\"/addhost\">this page</a>.";
    context.head = app.renderPart("viewhost-header.html", context);
    return app.render("viewhost.html", context);
  }

  context.key = h.key();
  context.url = h.url;
  context.head = app.renderPart("viewhost-header.html", context);
  return app.render("viewhost.html", context);
} // viewhost


/**
 * Return accumulated statistics for viewed host in JSON.
 */
function getdata(request, key) {
    var log = require("ringo/logging").getLogger(module.id);
    var context = {};
    var {Host} = require('models/host');
    var {HostQuery} = require('models/hostquery');
    var h = null;
    try {
        h = Host.get(key);
    } catch(e) {
        h = null;
    }
    if (!h) {
        return {
            status: 404,
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: ['{ERROR: "Not Found"}']
        }
    }
    var callback = request.params.callback;
    if (!callback) {
        return {
            status: 400,
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: ['{ERROR: "Bad Request"}']
        }
    }
    //context.url = h.url;
    var stats = [];
    var entityToObject = require("appengine/google/appengine/ext/db/utils").entityToObject;

    try {
        //stats = HostQuery.all().filter("host =", h.key()).fetch(10);
        var output = "[\n";
        var testTime = 1333238400000;
        var q;
        var results = HostQuery.all().ancestor(h).order("-executed").fetch(1000);
        for (var it in results) {
            q = results[it];
            testTime = q.executed.getTime();
            testTime = parseInt(testTime/1000)*1000;
            output += "{x:" + testTime.toString() +',y:' + q.time.toFixed(2) + "},\n" // name:" + '"'+q.status+'",' + "
            testTime += 86400000;
        }
        /*HostQuery.all().ancestor(h).order("-executed").limit(1000).forEach(function(q) {
            //stats.push( [testTime,q.time] ); // q.executed.getTime()
            output += "[" + q.executed.getTime().toString() +',' + q.time.toFixed(2) + "],\n"
            testTime += 86400000;
        });*/
        output = output.substr(0, output.length-2) + "\n]";
    } catch(e) {
        log.error(e.message ? e.message : e);
    }

    context.stats = stats;

    return {
        status: 200,
        headers: {"Content-Type": "text/javascript"},
        body: [callback + '(' + output + ');']
        //body: [callback + '(' + uneval(stats) + ');']
    };
} // getdata


/**
 * Returns hosts list from app/config/monitoring.cfg
 * Uses Java to access config file.
 *
 * @todo This is old stuff, to be deprecated.
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




/**
 * @todo: Add ability to query finalurl in case of original url inavailability.
 * @todo: Add Google Prediction?
 * @todo: Add notification server.
 * @todo: Notifications by XMPP.
 * @todo: Use Prospective search to filter failures and send notifications:
 *        https://developers.google.com/appengine/docs/java/prospectivesearch
 * @todo: Test API degradation with Capabilities Status Configuration: http://localhost:8080/_ah/admin/capabilitiesstatus
 */