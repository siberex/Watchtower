package sibli;

import java.util.*;

import java.io.IOException;
import javax.servlet.http.*;

//import org.apache.log4j.Logger;
import java.util.logging.Logger;

import sibli.PingerAsync;

/*
import javax.jdo.Query;
import javax.jdo.PersistenceManager;
import sibli.Host;
import sibli.PMF;
*/


/*
// For statistics.
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
*/

/**
 * PingTask class.
 *
 */
public class PingTask extends HttpServlet {
  private static final Logger LOG = Logger.getLogger(PingTask.class.getName());

  /**
   * 
   * 
   * @param req
   * @throws IOException 
   * @param resp
   *
   * @todo Catch com.google.apphosting.api.ApiProxy.OverQuotaException in case of qouta exceed:
   * https://developers.google.com/appengine/docs/quotas
   */
  public void doGet(HttpServletRequest req, HttpServletResponse resp)
  throws IOException {


    String backend = com.google.appengine.api.backends.BackendServiceFactory.getBackendService().getCurrentBackend(); // name of bakend or null

    //LOG.info("Launching task...");
    PingerAsync pinger = new PingerAsync(backend);
    pinger.ping();
    //LOG.info( ok );


    /*
    // Oh, Java. This means [{k: v}, {k: v}, {k: v}, ...]
    // List<HashMap<String,Object>>
    hosts = new ArrayList<HashMap<String,Object>>();
    HashMap<String,Object> host = null;

    PersistenceManager pm = PMF.get().getPersistenceManager();

    Query query = pm.newQuery(Host.class);
    query.setOrdering("updated desc");

    try {
        List<Host> results = (List<Host>) query.execute();
        if (!results.isEmpty()) {
            for (Host h : results) {
                // ...
                
                LOG.info( h.getUrl() + ", " + h.getAdded().toString() + ", " + String.valueOf( h.getStatus() ) );
            }
        } else {
            // ... no results ...
        }
    } finally {
        query.closeAll();
    }
    */


    /**
     * @todo Check for X-AppEngine-Cron: true request header.
     * If not exists, return text.
     */
    return;
    //resp.setContentType("text/plain");
    //resp.getWriter().println("Task launched ... " + ok);

    /*
    // Get statistics (https://developers.google.com/appengine/docs/java/datastore/stats):
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery globalStat = datastore.prepare( new Query("__Stat_PropertyType_Kind__") );
    for ( Entity stat : globalStat.asIterable() ) {
      resp.getWriter().println( stat.getProperty("kind_name") + " --- " + stat.getProperty("property_type") + " --- " + stat.getProperty("entity_bytes") );
    }
    */

  } // doGet



} // PingTask class


/**
@todo Handle big resultset warning on host view:
com.google.appengine.api.datastore.QueryResultsSourceImpl logChunkSizeWarning
WARNING: This query does not have a chunk size set in FetchOptions and has returned over 1000 results.
If result sets of this size are common for this query, consider setting a chunk size to improve performance.
To disable this warning set the following system property in appengine-web.xml (the value of the
property doesn't matter): 'appengine.datastore.disableChunkSizeWarning'


@todo We can implement usage for getRemainingMillis() in case of long-running task.
import  com.google.apphosting.api.ApiProxy;
long ApiProxy.getCurrentEnvironment().getRemainingMillis();
https://developers.google.com/appengine/docs/java/runtime#The_Request_Timer

Cursors:
https://developers.google.com/appengine/docs/java/datastore/queries#Query_Cursors

@todo Check environment to automatically distinct backend from frontend and set appropriate limits
https://developers.google.com/appengine/docs/java/javadoc/com/google/apphosting/api/ApiProxy.Environment

@todo Optimize write costs:
http://code.google.com/appengine/docs/billing.html#Billable_Resource_Unit_Cost
http://code.google.com/appengine/articles/indexselection.html

*2 Writes + 2-4 Writes per indexed property value (2w/ASC + 2w/DESC) + 1 Write per composite index value*
Even without custom indexes it will take 47088 writes to save 3924 entities 5 props each.
(12 write ops per entity = 2w + 2wpi*5props).
Each HostQuery entity = 10 write ops.

AppStats can be used for profiling:
https://developers.google.com/appengine/docs/java/tools/appstats?hl=ru-RU

@todo Save status and time properties as unindexed (?):
http://stackoverflow.com/questions/7318591/how-does-google-appengine-measure-datastore-put-operations


READ THIS TWICE A DAY!
http://googleappengine.blogspot.com/2009/06/10-things-you-probably-didnt-know-about.html
Especially about batch operations:
https://developers.google.com/appengine/docs/java/datastore/entities#Batch_Operations

*/