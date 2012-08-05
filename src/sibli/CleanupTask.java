package sibli;

import java.util.*;

import java.io.IOException;
import javax.servlet.http.*;

import java.util.logging.Logger;

public class CleanupTask extends HttpServlet {
    private static final Logger LOG = Logger.getLogger(PingTask.class.getName());
    
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
    throws IOException {
        LOG.info("Cleanup task started.");




    } // doGet
} // CleanupTask class