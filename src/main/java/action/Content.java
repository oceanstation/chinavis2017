package action;

import tool.HibernateUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.struts2.ServletActionContext;
import org.hibernate.Session;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author OCEAN
 * 根据startTime、endTime、phone或者type来查询短信内容
 */
public class Content extends ActionSupport {
    private InputStream inputStream;
    private int startTime;// timestamp
    private int endTime;// timestamp
    private String phone;// phone
    private int type;// timestamp

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String execute() throws IOException, ParseException {
        HttpServletResponse response = ServletActionContext.getResponse();
        response.setHeader("Access-Control-Allow-Origin", "*");

        HibernateUtil util = HibernateUtil.getInstance();
        Session session = util.openSession();

        List box = new ArrayList();
        List listMap;// 地图上的点

        if (type >= 0) {
            if (phone == null) {
                if (startTime < 1488297600) {
                    // 1488297600 对应 2017/3/1 0:0:0
                    listMap = session.createQuery("select content, count(*) from Tab2 where recitime > :startTime and recitime<= :endTime and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("type", type)
                            .list();
                } else if (startTime >= 1490976000) {
                    // 1490976000 对应 2017/4/1 0:0:0
                    listMap = session.createQuery("select content, count(*) from Tab4 where recitime > :startTime and recitime<= :endTime and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("type", type)
                            .list();
                } else {
                    listMap = session.createQuery("select content, count(*) from Tab3 where recitime > :startTime and recitime<= :endTime and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("type", type)
                            .list();
                }
            } else {
                if (startTime < 1488297600) {
                    // 1488297600 对应 2017/3/1 0:0:0
                    listMap = session.createQuery("select content, count(*) from Tab2 where recitime > :startTime and recitime<= :endTime and phone =:phone and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("phone", phone)
                            .setParameter("type", type)
                            .list();
                } else if (startTime >= 1490976000) {
                    // 1490976000 对应 2017/4/1 0:0:0
                    listMap = session.createQuery("select content, count(*) from Tab4 where recitime > :startTime and recitime<= :endTime and phone =:phone and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("phone", phone)
                            .setParameter("type", type)
                            .list();
                } else {
                    listMap = session.createQuery("select content, count(*) from Tab3 where recitime > :startTime and recitime<= :endTime and phone =:phone and type = :type group by content")
                            .setParameter("startTime", Integer.toString(startTime))
                            .setParameter("endTime", Integer.toString(endTime))
                            .setParameter("phone", phone)
                            .setParameter("type", type)
                            .list();
                }
            }

            for (int i = 0; i < listMap.size(); i++) {
                HashMap cop = new HashMap();
                cop.put("content", ((Object[]) listMap.get(i))[0]);
                cop.put("num", ((Object[]) listMap.get(i))[1]);
                cop.put("type", type);
                box.add(cop);
            }
        } else {
            if (startTime < 1488297600) {
                // 1488297600 对应 2017/3/1 0:0:0
                listMap = session.createQuery("select content, count(*), type from Tab2 where recitime > :startTime and recitime<= :endTime and phone =:phone group by content")
                        .setParameter("startTime", Integer.toString(startTime))
                        .setParameter("endTime", Integer.toString(endTime))
                        .setParameter("phone", phone)
                        .list();
            } else if (startTime >= 1490976000) {
                // 1490976000 对应 2017/4/1 0:0:0
                listMap = session.createQuery("select content, count(*), type from Tab4 where recitime > :startTime and recitime<= :endTime and phone =:phone group by content")
                        .setParameter("startTime", Integer.toString(startTime))
                        .setParameter("endTime", Integer.toString(endTime))
                        .setParameter("phone", phone)
                        .list();
            } else {
                listMap = session.createQuery("select content, count(*), type from Tab3 where recitime > :startTime and recitime<= :endTime and phone =:phone group by content")
                        .setParameter("startTime", Integer.toString(startTime))
                        .setParameter("endTime", Integer.toString(endTime))
                        .setParameter("phone", phone)
                        .list();
            }

            for (int i = 0; i < listMap.size(); i++) {
                HashMap cop = new HashMap();
                cop.put("content", ((Object[]) listMap.get(i))[0]);
                cop.put("num", ((Object[]) listMap.get(i))[1]);
                cop.put("type", ((Object[]) listMap.get(i))[2]);
                box.add(cop);
            }
        }

        util.closeSession(session);

        ObjectMapper mapper = new ObjectMapper();

        String res = mapper.writeValueAsString(box);

        inputStream = new ByteArrayInputStream(res.getBytes("UTF-8"));

        System.out.println(res);

        return SUCCESS;
    }
}
