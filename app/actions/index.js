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

    /* for (var i in allhosts) {
        h = allhosts[i];
        h.viewed = h.viewed || h.added;
        h.views = h.views || 0;
        h.put();
    } */

    log.info( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() );
    return app.render("test.html", {title  : "TEST", test: test});

  //log.info( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() );
  //return app.render("test.html", {title  : "TEST"});

  /*
  var startCursor = request.params.cursor || null; 
  if (startCursor == "no-cursor") startCursor = null;

  var datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getDatastoreService();
  var query = new com.google.appengine.api.datastore.Query("HostQuery");

  query.addFilter("status", com.google.appengine.api.datastore.Query.FilterOperator.NOT_EQUAL, null);

  // PreparedQuery contains the methods for fetching query results from the datastore.
  var pq = datastore.prepare(query);

  // Instead of multiple datastore puts and having sex with cursors let’s use batch datastore write.
  var fetchOptions = com.google.appengine.api.datastore.FetchOptions.Builder.withChunkSize(50000).limit(50000);
  var hqList = pq.asQueryResultList( fetchOptions );
  var hqIterator = hqList.listIterator();
  var hq = null;
  try {
    while ( hqIterator.hasNext() ) {
        hq = hqIterator.next();
      //hq.removeProperty("host");
        hq.setUnindexedProperty("status", hq.getProperty('status'));
        hq.setUnindexedProperty("time", hq.getProperty('time'));
        hqIterator.set(hq);
    }
    datastore.put(hqList);
  } catch (e) {
    log.info( e.message );
    log.info( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() );
    return app.render("test.html", {title  : "TEST", test: test, error: e.message});
  }
  */

  /*
  // Multiple puts is a bad way...
  var fetchOptions = com.google.appengine.api.datastore.FetchOptions.Builder.withChunkSize(5000).limit(5000);
  if ( startCursor ) {
    try {
      var decodedCursor = com.google.appengine.api.datastore.Cursor.fromWebSafeString(startCursor);
      fetchOptions = fetchOptions.startCursor( decodedCursor );
    } catch (e) {
      // java.lang.IllegalArgumentException: Unable to decode provided cursor.
      startCursor = null;
    } 
  }
  var hqIterator = pq.asQueryResultIterator( fetchOptions );

  var cursor = null;
  var hq = null;
  try {
    while ( hqIterator.hasNext() ) {
      hq = hqIterator.next();
      //hq.getProperty("executed");
      hq.removeProperty ("host");
      datastore.put(hq);
      cursor = hqIterator.getCursor();
      if ( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() < 1001 ) {
        break;
      }
    }
  } catch (e) {
    //log.info( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() );
    // java.lang.IllegalArgumentException: The requested query has expired. Please restart it with the last cursor to read more results.
    // com.google.appengine.api.datastore.DatastoreFailureException: query has expired or is invalid. Please restart it with the last cursor to read more results.
    test = cursor ? cursor.toWebSafeString() : "no-cursor";
    return app.render("test.html", {title  : "TEST", test: test, error: e.message});
  }

  //log.info( com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getRemainingMillis() );

  test = cursor ? cursor.toWebSafeString() : "no-cursor";
  return app.render("test.html", {title  : "TEST", test: test});
  */

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