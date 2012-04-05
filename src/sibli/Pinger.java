package sibli;

import java.util.*;

import java.net.HttpURLConnection;
import java.net.URL;

//import java.io.BufferedReader;
//import java.io.InputStreamReader;
import java.io.IOException;
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
  
  public static void main(String[] args) {
    // Just in case.
  } // main

  /**
   * Pings provided url and returns status code from response.
   *
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
} // Pinger class