package sibli;

import java.io.IOException;
import javax.servlet.http.*;

//import org.apache.log4j.Logger;
import java.util.logging.Logger;

/**
 * PingTask class.
 *
 */
public class PingTask extends HttpServlet {
  private static final Logger LOG = Logger.getLogger(PingTask.class.getName());

  public void doGet(HttpServletRequest req, HttpServletResponse resp)
  throws IOException {


    LOG.info("Ololo!");

    /**
     * @todo Check for X-AppEngine-Cron: true request header.
     * If not exists, retun text.
     */
    resp.setContentType("text/plain");
    resp.getWriter().println("Task launched");

  } // doGet



} // PingTask class