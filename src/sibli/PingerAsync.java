package sibli;

import java.util.*;
import java.util.concurrent.*;
import java.util.regex.*;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import java.io.FileInputStream;
import java.io.DataInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.io.IOException;
import java.io.FileNotFoundException;

//import org.apache.log4j.Logger;
import java.util.logging.Logger;

//////import javax.jdo.Query;
//////import javax.jdo.PersistenceManager;

// Google App Engine specific
import com.google.appengine.api.urlfetch.URLFetchService;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;

import static com.google.appengine.api.urlfetch.FetchOptions.Builder.*;
import com.google.appengine.api.urlfetch.FetchOptions;

import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;

import com.google.appengine.api.datastore.DatastoreService;
//import com.google.appengine.api.datastore.AsyncDatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;

import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

//////import sibli.Host;
//////import sibli.PMF;


/**
 * PingerAsync class.
 *
 */
public class PingerAsync {
  //public static final Logger LOG = Logger.getLogger(PingerAsync.class);
  private static final Logger LOG = Logger.getLogger(PingerAsync.class.getName());
  
  final int maxConcurrentRequests = 10;
  protected List<HashMap<String,Object>> hosts = null;
  protected List<HashMap<String,Object>> hostsQueue = null;
  protected List<HashMap<String,Object>> hostsPolled = null;


  public PingerAsync() {
    this( getSources() );
  } // constructor
  public PingerAsync(List<HashMap<String,Object>> hosts) {

    this.hosts = hosts;
    this.hostsQueue = new ArrayList<HashMap<String,Object>>(this.maxConcurrentRequests);
  } // constructor


  public static void main(String[] args) {

    List<HashMap<String,Object>> hosts = getSources();
        
    Iterator<HashMap<String,Object>> it = hosts.iterator();
    while( it.hasNext() ) {
      System.out.println( "Host: " + it.next().toString() );
    }

  } // main



  /**
   * Pings provided url list and returns status code from response.
   *
   */
  public String ping() throws InterruptedException, ExecutionException
  {

    HTTPRequest request = null;
    FetchOptions options = allowTruncate().followRedirects().doNotValidateCertificate().setDeadline(5.0);
    URLFetchService fetcher = URLFetchServiceFactory.getURLFetchService();

    Future<HTTPResponse> responseFuture;
    HTTPResponse response;    

    int code;

    HashMap<String,Object> h;
    Iterator<HashMap<String,Object>> it = hosts.iterator();

    // NB for non-GAE implementations: ArrayList is NOT synchronized structure!
    // Adding first maxConcurrentRequests from hosts to queue:

    while ( hosts.size() > 0 ) {
      while ( it.hasNext() ) {
        h = it.next();
        System.out.println( "Host: " + h.toString() );
        h.get("href");

      } // while
    } // while

    try {
      //hosts.removeRange(int fromIndex, int toIndex)

      URL url = new URL("http://www.sib.li");

      request = new HTTPRequest(
          url,
          HTTPMethod.HEAD,
          options
      );
      
      long startTime = System.currentTimeMillis();

      responseFuture = fetcher.fetchAsync(request);
      response = responseFuture.get();
      code = response.getResponseCode();






      //connection.setRequestProperty("HTTP_USER_AGENT", "Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.9.168 Version/11.52");


      
      return Integer.toString(code);




    } catch (MalformedURLException e) {
      //return "Malformed URL";
    }/* catch (IllegalArgumentException e) {
      return "URL is null";
    }*/ catch (IOException e) {
      return "Host unreachable";
    } /*finally {
      return "";
    }*/
    return "";

  } // ping



  /**
   * Reads hosts from Database and returns the as list.
   *
   * @return List
   */
  public static final List<HashMap<String,Object>> getSourcesDb()
  {
    // Oh, Java. This means [{k: v}, {k: v}, {k: v}, ...]
    List<HashMap<String,Object>> hosts = new ArrayList<HashMap<String,Object>>();
    HashMap<String,Object> host = null;

    /*
    PersistenceManager pm = PMF.get().getPersistenceManager();

    Query query = pm.newQuery(Host.class);
    query.setOrdering("updated desc");

    try {
        List<Host> results = (List<Host>) query.execute();
        if (!results.isEmpty()) {
            for (Host h : results) {
                // ...
                
                LOG.info( h.getUrl() + ", " + h.getAdded().toString() + ", " + h.getStatus().toString() );
            }
        } else {
            // ... no results ...
        }
    } finally {
        query.closeAll();
    }
    */


    // Get the Datastore Service
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    // The Query interface assembles a query
    Query q = new Query("Host");

    // PreparedQuery contains the methods for fetching query results from the datastore
    PreparedQuery pq = datastore.prepare(q);

    for ( Entity result : pq.asIterable() ) {
      host = new HashMap<String,Object>();

      String url = (String) result.getProperty("url");
      host.put( "host", url ); // host
      host.put( "href", url );
      host.put( "added", (Date) result.getProperty("added") );
      host.put( "updated", (Date) result.getProperty("updated") );
      host.put( "status", String.valueOf(result.getProperty("status")) );
      
      hosts.add( host );

      Date added = (Date) result.getProperty("added");
      String status = String.valueOf(result.getProperty("status"));
      LOG.info( url + ", " + added.toString() + ", " + status.toString() );
    }


    return hosts;
  } // getSourcesDb


  /**
   * Reads hosts from config file app/config/monitoring.cfg
   * and returns the as list.
   *
   * @return List
   */
  public static final List<HashMap<String,Object>> getSources()
  {
    String config = "app/config/monitoring.cfg";

    FileInputStream fstream = null;
    DataInputStream input   = null;
    BufferedReader bufferReader = null;

    //List<String> hosts = new ArrayList<String>();

    // Oh, Java. This means [{k: v}, {k: v}, {k: v}, ...]
    List<HashMap<String,Object>> hosts = new ArrayList<HashMap<String,Object>>();
    HashMap<String,Object> host = null;

    String readLine = null;
    String[] parsedLine = null;
    String href = null;
    String html = null;

    Pattern urlRe = Pattern.compile("^(?:(https?|ftp)://)?([a-z0-9-]+(?:\\.[a-z0-9-]+)+)?(.*?)?(?:(\\w+\\.\\w+)([^.]*))?$");
    Matcher urlMatcher = null;

    try {
      fstream = new FileInputStream(config);
      input   = new DataInputStream(fstream);
      bufferReader = new BufferedReader( new InputStreamReader(input) );

      while ( ( readLine = bufferReader.readLine() ) != null ) {
        if (readLine.trim().length() == 0)
          continue;

        parsedLine = readLine.split("\t");
        href = parsedLine[0].trim();
        if (href.length() == 0)
          continue;

        urlMatcher = urlRe.matcher(href);

        if ( !urlMatcher.matches() || urlMatcher.group(2) == null )
          continue;

        html = (parsedLine.length < 2) ? "" : parsedLine[1].trim();

        host = new HashMap<String,Object>();
        host.put( "host", urlMatcher.group(2).intern() ); // host
        host.put( "href", href );
        host.put( "html", html );
        
        hosts.add( host );
      } // while
  
    } catch (FileNotFoundException e) {
      //System.out.println( "File not found: " + e.getMessage() );
    } catch (IOException e) {
      //System.out.println( "Error: " + e.getMessage() );
    } finally {
      try {
        if (fstream != null)
          fstream.close();
        if (input != null)
          input.close();
        if (bufferReader != null)
            bufferReader.close();
      } catch (IOException e) {
        // do nothing
      }
    } // finally
    
    return hosts;
  } //getSources

} // PingerAsync class


/**
 Useful links:

 http://code.google.com/intl/en/appengine/docs/java/urlfetch/overview.html
 http://code.google.com/appengine/docs/java/javadoc/com/google/appengine/api/urlfetch/package-summary.html

 http://ikaisays.com/2010/06/29/using-asynchronous-urlfetch-on-java-app-engine/

 */