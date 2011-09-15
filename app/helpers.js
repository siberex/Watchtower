var {app} = require("./main");

var strings = require("ringo/utils/strings");
var dates = require("ringo/utils/dates");
//var mustache = require("ringo/mustache");

export(
  "baseUrl",
  "getLang",
  "timeFormat"
);

function baseUrl(name) {
  name = name && name.replace(/\s/g, '_');
  var url = (app.base || "") + "/";
  return name ? url + encodeURI(name) : url;
}

function timeFormat(date) {
  return dates.format(date, "HH:mm");
}

/**
 * Get (or guess) the language of viewer.
 * @param {Request} request
 */
function getLang(request) {
  var langMap = {
    "ru" : "ru",
    "en" : "en",
    "default" : "en" // default language
  };
  var countryMap = {
    "RU" : "ru",
    "BY" : "ru",
    "UA" : "ru",
    "ZZ" : langMap.default
  };

  // TODO: Get language was set by user directly (saved in cookie).

  // Country to language conversion is not a good idea in most cases.
  // Note that x-appengine-country is AppEngine-specific header.
  var country = request.headers["x-appengine-country"];
  var lang = false;

  if (!country || country == "ZZ" || !countryMap[country]) {
    var acceptLangs = request.headers["accept-language"];

    /***
    // Rhino JavaScript does not support look-behind assertion, so I use Java call here.
    // http://www.regular-expressions.info/lookaround.html
    // Replaced later with simplified RegExp in Javascript.
    var re = "([a-z]{2})(?=-[a-z]{2})|(?<!-)([a-z]{2})(?=;|,)";
    var pattern = java.util.regex.Pattern.compile(re, java.util.regex.Pattern.CASE_INSENSITIVE);
    var matcher = pattern.matcher(acceptLangs);
    var res = [];
    while ( matcher.find() ) {
      if ( res.indexOf( matcher.group() ) == -1 )
        res.push( matcher.group() );
    }
    ***/

    // Get accepted languages from header.
    // en-CA,en;q=0.8,en-US;q=0.6,de-DE;q=0.4,de;q=0.2 → [en, de]
    var re = /(^|;|,)([a-z]{2})/ig;
    var found = false,
        i = 0;
    var res = [];

    while ( found = re.exec(acceptLangs) ) {
      if ( res.indexOf( found[2] ) == -1 )
        res.push( found[2].toLowerCase() );
    }

    found = false;
    while ( !found && i < res.length ) {
      found = langMap[ res[i++] ];
    }
    lang = found ? found : langMap.default;
  } else {
    lang = countryMap[country];
  }

  return lang;
}