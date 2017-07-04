package tool;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

/**
 * Created by OCEAN on 2017/5/20.
 */
public class HibernateUtil {

	private static HibernateUtil instance;

	private SessionFactory sessionFactory;

	private HibernateUtil() {
		Configuration cfg = new Configuration().configure();
		sessionFactory = cfg
				.buildSessionFactory(new StandardServiceRegistryBuilder().applySettings(cfg.getProperties()).build());
	}

	public Session openSession() {
		return sessionFactory.openSession();
	}

	public void closeSession(Session session) {
		if (null != session) {
			session.close();
		}
	}

	public static HibernateUtil getInstance() {
		if (instance == null)
			instance = new HibernateUtil();
		return instance;
	}
}