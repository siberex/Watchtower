package sibli;

import java.util.*;
import java.util.regex.*;

import java.net.HttpURLConnection;
import java.net.URL;

import java.io.FileInputStream;
import java.io.DataInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.io.IOException;
import java.io.FileNotFoundException;

import java.net.MalformedURLException;
import java.net.SocketTimeoutException;

//import org.apache.log4j.Logger;
import java.util.logging.Logger;

import java.text.DecimalFormat;


/**
 * Pinger class.
 *
 */
public class Pinger {
  //public static final Logger LOG = Logger.getLogger(Pinger.class);
  private static final Logger LOG = Logger.getLogger(Pinger.class.getName());

  private static final int maxConcurrentRequests = 10;
  
  protected List<HashMap<String,Object>> hosts = null;
  protected List<HashMap<String,Object>> hostsQueue = null;


  public Pinger() {
    this( getSources() );
  } // constructor
  
  public Pinger(List<HashMap<String,Object>> hosts) {
    this.hosts = hosts;
    this.hostsQueue = new ArrayList<HashMap<String,Object>>(this.maxConcurrentRequests);
  } // constructor

  public static void main(String[] args) {
    // Just in case.
    List<HashMap<String,Object>> hosts = getSources();

    Iterator<HashMap<String,Object>> it = hosts.iterator();
    while( it.hasNext() ) {
      System.out.println( "Host: " + it.next().toString() );
    }
  } // main

    /**
     * @var User agent.
     */
    private static final String userAgent = "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.10.229 Version/11.61";

    /**
     * Poll provided url and return results in HashMap properties:
     *   - status
     *   - responseTime
     *   - statusText (optional)
     *   - finalUrl (optional)
     *   - useGet (optional)
     * @param url
     * @return
     */
    public static HashMap<String, Object> poll(String url)
    throws MalformedURLException, IllegalArgumentException
    {
        HashMap<String, Object> result = null;
        HttpURLConnection connection = null;
        long startTime = System.nanoTime();

        try {
            URL u = new URL(url);
            connection = (HttpURLConnection) u.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setRequestProperty("HTTP_USER_AGENT", userAgent);

            connection.setConnectTimeout(5100);
            connection.setReadTimeout(5100);

            int code = connection.getResponseCode();

            if (code == 405) {
                result.put("useGet", true);
                connection.setRequestMethod("GET");
            }

            double time = ( System.nanoTime() - startTime ) / 1000000000.0;
            connection.getOutputStream().close();

            result.put("responseTime", time);
            result.put("status", code);
            result.put( "statusText", connection.getResponseMessage() );

        } catch (MalformedURLException e) {
            // Malformed URL
            LOG.warning( e.getMessage() );
            throw e;
        } catch (IllegalArgumentException e) {
            // URL is null
            LOG.warning( e.getMessage() );
            throw e;
        } catch (SocketTimeoutException e) {
            // Timeout
            double time = ( System.nanoTime() - startTime ) / 1000000000.0;
            result.put("responseTime", time);
            result.put("status", 598);
            result.put("statusText", "Network read timeout error");
        } catch (IOException e) {
            // Host unreachable
            double time = ( System.nanoTime() - startTime ) / 1000000000.0;
            result.put("responseTime", time);
            result.put("status", 599);
            result.put("statusText", "Network connect timeout error");
        } finally {
            if (connection != null) {
                try {
                    connection.getInputStream().close();
                    connection.disconnect();
                } catch (IOException e) {
                    LOG.warning( e.getMessage() );
                }
            }
            return result;
        }

    } // poll


  /**
   * Pings provided url and returns status code from response.
   * @deprecated In favor of poll() method.
   */
  public static String ping(String url)
  {
    HttpURLConnection connection = null;

    long startTime = System.nanoTime();
    LOG.info("Pinging " + url + "...");

    try {
      URL u = new URL(url);
      connection = (HttpURLConnection) u.openConnection();
      connection.setRequestMethod("HEAD");
      connection.setRequestProperty("HTTP_USER_AGENT", "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.10.229 Version/11.61");

      connection.setConnectTimeout(5000);
      connection.setReadTimeout(5000);

      int code = connection.getResponseCode();
      //connection.getOutputStream().close();

      double time = ( System.nanoTime() - startTime ) / 1000000000.0;
      LOG.info("\t\t done in " + (new DecimalFormat("#.#####").format(time)) + " s");

      return Integer.toString(code);

    } catch (MalformedURLException e) {
      return "Malformed URL";
    } catch (IllegalArgumentException e) {
      return "URL is null";
    } catch (SocketTimeoutException e) {
      LOG.info("\t failed after " + (new DecimalFormat("#.#####").format( ( System.nanoTime() - startTime ) / 1000000000.0 )) + " s");
      return "Timeout";
    } catch (IOException e) {
      return "Host unreachable";
    } finally {
      if (connection != null) {
        try {
          connection.getInputStream().close();
        } catch (IOException e) {
          // do nothing.
        }
      }
    }
  } // ping


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

} // Pinger class