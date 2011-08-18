var {app} = require("./main");

var strings = require("ringo/utils/strings");
var dates = require("ringo/utils/dates");
//var mustache = require("ringo/mustache");

export(
  "baseUrl",
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
