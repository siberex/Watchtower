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
  var {HostQuery} = require('models/hostquery');
  var h, parsedUrl;
  //var allhosts = Host.all().fetch(1000);

  var datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getDatastoreService();

  /*
  var hqs = HostQuery.all().fetch(10000);
  for (var i in hqs) {
    //hqs[i].host = null;
    //hqs[i].delattr("host");
    //delete(hqs[i].host);
    hqs[i].put();
  }
  **/

  return app.render("test.html", {title  : "TEST"});
  /*
  var hqs = HostQuery.all().filter("time >", 4000).filter("status =", 599).fetch(100000);
  for (var i in hqs) {
    hqs[i].status = 598;
    hqs[i].put();
  }
  */
  /*var urlMatchRe = /^(?:(https?|ftp):\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)?(.*?)?(?:(\w+\.\w+)([^.]*))?$/;

  for (var i in allhosts) {
    h = allhosts[i];
    parsedUrl = h.url.match(urlMatchRe);
    if (!parsedUrl[0] || !parsedUrl[2])
      continue;
    h.domain = parsedUrl[2];
    log.info( h.domain, h.url );
    h.put();
  }*/
  /*for (var i in allhosts) {
    h = allhosts[i];
    h.finalurl = null;
    h.put();
  }*/

  /*
  h = allhosts[0];
  var hq = new HostQuery({
    host : h.key(),
    status: 888,
    time: 1000,
    parent: h.key()
  });  
  hq.put();
  */

  //throw new Error("Absolutely unexpected error!");
  //return app.render("test.html", {title  : "TEST"});
} // test