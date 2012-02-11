package sibli;

import java.util.*;
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


/**
 * PingerAsync class.
 *
 */
public class PingerAsync {
  
  public static void main(String[] args) {
    List<String> hosts = null;
    
    hosts = getSources();
        
    Iterator it = hosts.iterator();

    while( it.hasNext() ) {
      System.out.println( "-> " + (String)it.next() );
    }

  } // main


  /**
   * Reads hosts from config file app/config/monitoring.cfg
   * and returns the as list.
   *
   * @return List
   */
  public static List<String> getSources()
  {
    String config = "app/config/monitoring.cfg";

    FileInputStream fstream = null;
    DataInputStream input   = null;
    BufferedReader bufferReader = null;

    List<String> hosts = new ArrayList<String>();

    String readLine = null;
    String[] parsedLine = null;
    String href = null;

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

        hosts.add( urlMatcher.group(2).intern() );
      } // while
  
      return hosts;
    } catch (FileNotFoundException e) {
      
      //System.out.println( "File not found: " + e.getMessage() );      
      return hosts;
    } catch (IOException e) {
      
      //System.out.println( "Error: " + e.getMessage() );
      return hosts;
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
  } //getSources


  /**
   * Pings provided url list and returns status code from response.
   *
   */
  public static String ping(List<String> hosts)
  {
    //HttpURLConnection connection = null;

    /**
     * /About async connections/
     * http://code.google.com/intl/en/appengine/docs/java/urlfetch/overview.html
     * 
     * An asynchronous request to the URL Fetch service starts the request, then returns immediately with an object.
     * The application can perform other tasks while the URL is being fetched. When the application needs the results,
     * it calls a method on the object, which waits for the request to finish if necessary, then returns the result.
     * The app can have up to 10 simultaneous asynchronous URL Fetch calls. If any URL Fetch requests are pending
     * when the request handler exits, the application server waits for all remaining requests to either return
     * or reach their deadline before returning a response to the user.
     *
     * In Java, the asynchronous interface is only available when using the low-level API directly.
     * The fetchAsync() method returns a java.util.concurrent.Future<HTTPResponse>.
     */


    return "";

    /*try {




      //URL u = new URL("www.sib.li");
      //connection = (HttpURLConnection) u.openConnection();
      //connection.setRequestMethod("HEAD");
      //connection.setRequestProperty("HTTP_USER_AGENT", "Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.9.168 Version/11.52");
      
      //connection.setConnectTimeout(30);
      //connection.setReadTimeout(30);

      //int code = connection.getResponseCode();
      //return Integer.toString(code);



    } catch (MalformedURLException e) {
      return "Malformed URL";
    } catch (IllegalArgumentException e) {
      return "URL is null";
    } catch (IOException e) {
      return "Host unreachable";
    }*/

  } // ping

} // PingerAsync class