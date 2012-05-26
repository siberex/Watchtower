package sibli;

import java.util.*;
import java.util.concurrent.*;

//import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import java.io.IOException;

//import org.apache.log4j.Logger;
import java.util.logging.Logger;


// Google App Engine specific
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

import static com.google.appengine.api.urlfetch.FetchOptions.Builder.*;
import com.google.appengine.api.urlfetch.FetchOptions;

import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.HTTPHeader;

import com.google.appengine.api.datastore.DatastoreService;
//import com.google.appengine.api.datastore.AsyncDatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;

import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

import com.google.appengine.api.datastore.Entity;
//import com.google.appengine.api.datastore.Key;
//import com.google.appengine.api.datastore.KeyFactory;



/**
 * PingerAsync class.
 *
 */
public class PingerAsync {
  private static final Logger LOG = Logger.getLogger(PingerAsync.class.getName());
  
  private static final double requestTimeout = 5.0; // Seconds
  private static final int maxConcurrentRequests = 10;
  private static final String userAgent = "Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.9.168 Version/11.52";

  protected ArrayList<Entity> hostsQueue = null;
  protected ArrayList<Entity> hostsPolled = null;

  protected java.util.Iterator<Entity> hostsIterator = null;

  public PingerAsync() {
    /**
     * @todo Check throws.
     */

    // Oh, Java. This means [{k: v}, {k: v}, {k: v}, ...]
    this.hostsQueue = new ArrayList<Entity>();
    Entity host = null;

    /**
     * HashSet have better performance for multiple insertions and deletions
     * but it does not preserve elements ordering.
     */
    this.hostsPolled = new ArrayList<Entity>();

    // Get the Datastore Service
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    // The Query interface assembles a query.
    Query q = new Query("Host");
    q.addSort("updated", Query.SortDirection.DESCENDING);

    // PreparedQuery contains the methods for fetching query results from the datastore.
    PreparedQuery pq = datastore.prepare(q);

    // For PreparedQuery.asIterator() results will be fetched asynchronously.
    // https://developers.google.com/appengine/docs/java/datastore/async#Async_Queries
    this.hostsIterator = pq.asIterator();

    int i = 0;

    // Adding first 10 hosts to queue.
    while (this.hostsIterator.hasNext() && i < maxConcurrentRequests) {
      host = this.hostsIterator.next();
      this.hostsQueue.add(host);
      i++;
    }

  } // constructor

  public static void main(String[] args) {
    System.out.println( "Error: This class should not be run in CLI mode." );
  } // main



  /**
   * Pings provided url list and returns status code from response.
   *
   */
  public String ping() //throws InterruptedException, ExecutionException
  {
    
    HTTPRequest request = null;
    // @todo ? Use FetchOptions.Builder.allowTruncate().followRedirects().doNotValidateCertificate().setDeadline(requestTimeout);
    // (check imports beforehand)
    FetchOptions fetchOptions = allowTruncate().followRedirects().doNotValidateCertificate().setDeadline(requestTimeout);
    HTTPHeader uaHeader = new HTTPHeader("HTTP_USER_AGENT", userAgent);
    URLFetchService fetcher = URLFetchServiceFactory.getURLFetchService();

    Future<HTTPResponse> responseFuture;
    /**
     * Should represent hostsQueue host’s Future responses.
     * @var HashMap
     */
    HashMap<Long, Future<HTTPResponse>> listResponses =
            new HashMap<Long, Future<HTTPResponse>>( this.hostsQueue.size(), (float) 1.25 );
    long timeStart;
    long timeEnd;
    Entity h;
    String sUrl;
    //int i;
    //URL url;
    ListIterator<Entity> it = this.hostsQueue.listIterator();
    // NB for non-GAE implementations: ArrayList is NOT synchronized structure!
    // Queuing first 10 hosts (maxConcurrentRequests is 10 by default):
    while ( it.hasNext() ) {
      //i = it.nextIndex();
      h = it.next(); 
      //LOG.info( "Host: " + h.toString() );
      sUrl = (String) h.getProperty("url");
      try {
        request = new HTTPRequest(
            new URL(sUrl),
            HTTPMethod.HEAD,
            fetchOptions
        );
        request.setHeader(uaHeader);
        
        timeStart = System.nanoTime();
        responseFuture = fetcher.fetchAsync(request);

        h.setUnindexedProperty("timeStart", timeStart);               /////////////// h.removeProperty("timeStart");
        listResponses.put( h.getKey().getId(), responseFuture );
        it.set(h); // Overwrite previous value, new fields added.
        
      } catch (MalformedURLException e) {
        // This should not happen. Can be throwed by new URL().
        LOG.info(e.getMessage());
      } catch (IllegalArgumentException e) {
        // This should not happen. Can be throwed by h.setUnindexedProperty().
        LOG.info(e.getMessage());
      } catch (IOException e) {
        // This should not happen. Can be throwed by fetcher.fetchAsync(request).
        LOG.info(e.getMessage());
      }
    } // while

    h = null;
    responseFuture = null;

    HTTPResponse response;
    int code = 0;

    //while (this.hostsIterator.hasNext())
    while ( this.hostsQueue.size() > 0 ) {
      //

      //response = responseFuture.get();
      //code = response.getResponseCode();

      listResponses.remove( this.hostsQueue.get(0).getKey().getId() );
      this.hostsQueue.remove(0);
    }


    //h.put(sUrl, url)
    //hostsPolled.add(h);


    /************
    hosts = queryDB
    queueSize = 0;
    queue = new List
    while ( hosts.iterator.hasNext() || queueSize < maxConcurrentRequests ) {
      queue.add(host.data)
      queueSize++;
    }

    finished = new List
    while ( queue.size > 0 ) {
      startPing( queue.next )

    }


    1.10 infinite iterator
    queue
    queueRun[10]
    timers[10]?

    *************/
    return "OK";

  } // ping

} // PingerAsync class

/**
 * @todo Add indexes to datastore:
 * https://developers.google.com/appengine/docs/java/datastore/queries?hl=en-US#Introduction_to_Indexes
 * 
 */

/**
 Useful links:

 http://code.google.com/intl/en/appengine/docs/java/urlfetch/overview.html
 http://code.google.com/appengine/docs/java/javadoc/com/google/appengine/api/urlfetch/package-summary.html

 http://ikaisays.com/2010/06/29/using-asynchronous-urlfetch-on-java-app-engine/

 */