package sibli;

import java.io.IOException;
import javax.servlet.http.*;


/**
 * PingTask class.
 *
 */
public class PingTask extends HttpServlet {

  public void doGet(HttpServletRequest req, HttpServletResponse resp)
  throws IOException {




    /**
     * @todo Check for X-AppEngine-Cron: true request header.
     * If not exists, retun text.
     */
    resp.setContentType("text/plain");
    resp.getWriter().println("Task launched");

  } // doGet



} // PingTask class