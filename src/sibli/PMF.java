package sibli;

import java.util.*;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

public final class PMF {
    private static final PersistenceManagerFactory pmfInstance =
        JDOHelper.getPersistenceManagerFactory("transactions-optional");

    /*
    // Set options bypassing jdoconfig.xml
    private static PersistenceManagerFactory pmfInstance;
    static {
        Map props = new HashMap();
        props.put("javax.jdo.PersistenceManagerFactoryClass", "org.datanucleus.store.appengine.jdo.DatastoreJDOPersistenceManagerFactory");
        props.put("javax.jdo.option.ConnectionURL", "appengine");
        props.put("javax.jdo.option.NontransactionalRead", "true");
        props.put("javax.jdo.option.NontransactionalWrite", "true");
        props.put("javax.jdo.option.RetainValues", "true");
        props.put("datanucleus.appengine.autoCreateDatastoreTxns", "true");
        pmfInstance = JDOHelper.getPersistenceManagerFactory(props);
    }
    */
    
    private PMF() {}

    public static PersistenceManagerFactory get() {
        return pmfInstance;
    }

} // PMF class