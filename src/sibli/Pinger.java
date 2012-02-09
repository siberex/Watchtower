package sibli;

import java.util.*;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

//import java.io.BufferedReader;
//import java.io.InputStreamReader;
import java.io.IOException;

/**
 * Pinger class.
 *
 */
public class Pinger {
  
  public static void main(String[] args) {
    // Just in case.
  }

  /**
   * Pings provided url and returns status code from response.
   *
   */
  public static String ping(String url)
  {
    HttpURLConnection connection = null;

    try {
      URL u = new URL(url);
      connection = (HttpURLConnection) u.openConnection();
      connection.setRequestMethod("HEAD");
      connection.setRequestProperty("HTTP_USER_AGENT", "Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.9.168 Version/11.52");

      //connection.setConnectTimeout(30);
      //connection.setReadTimeout(30);

      int code = connection.getResponseCode();
      return Integer.toString(code);

    } catch (MalformedURLException e) {
      return "Malformed URL";
    } catch (IllegalArgumentException e) {
      return "URL is null";
    } catch (IOException e) {
      return "Host unreachable";
    }
  }



} // class Pinger