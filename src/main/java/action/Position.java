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
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * @author OCEAN
 * 根据startTime、endTime和type来查询数据
 */
public class Position extends ActionSupport {
    private InputStream inputStream;
    private String startTime;// timestamp
    private String endTime;// timestamp
    private int type;// 枚举类型

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
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

        Date stime = new Date(Long.parseLong(startTime));
        Date etime = new Date(Long.parseLong(endTime));

        List box = new ArrayList();
        List listMap;// 地图上的点
        List boxPhone = new ArrayList();
        List listPhone;// 发送方号码
        int[] bars = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

        if (type >= 0) {
            if (startTime.compareTo("1488297600000") < 0) {
                // 1488297600000 对应 2017/3/1 0:0:0
                listMap = session.createQuery("select content, lng, lat, type from Tab2 where recitime > :startTime and recitime<= :endTime and type= :type")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab2 where recitime > :startTime and recitime<= :endTime and type= :type group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .setMaxResults(15)
                        .list();

            } else if (startTime.compareTo("1490976000000") >= 0) {
                // 1490976000000 对应 2017/4/1 0:0:0
                listMap = session.createQuery("select content, lng, lat, type from Tab4 where recitime > :startTime and recitime<= :endTime and type= :type")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab4 where recitime > :startTime and recitime<= :endTime and type= :type group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .setMaxResults(15)
                        .list();
            } else {
                listMap = session.createQuery("select content, lng, lat, type from Tab3 where recitime > :startTime and recitime<= :endTime and type= :type")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab3 where recitime > :startTime and recitime<= :endTime and type= :type group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setParameter("type", type)
                        .setMaxResults(15)
                        .list();
            }
        } else {
            if (startTime.compareTo("1488297600000") < 0) {
                // 1488297600000 对应 2017/3/1 0:0:0
                listMap = session.createQuery("select content, lng, lat, type from Tab2 where recitime > :startTime and recitime<= :endTime and type >= 0")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab2 where recitime > :startTime and recitime<= :endTime and type >= 0 group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setMaxResults(15)
                        .list();

            } else if (startTime.compareTo("1490976000000") >= 0) {
                // 1490976000000 对应 2017/4/1 0:0:0
                listMap = session.createQuery("select content, lng, lat, type from Tab4 where recitime > :startTime and recitime<= :endTime and type >= 0")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab4 where recitime > :startTime and recitime<= :endTime and type >= 0 group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setMaxResults(15)
                        .list();
            } else {
                listMap = session.createQuery("select content, lng, lat, type from Tab3 where recitime > :startTime and recitime<= :endTime and type >= 0")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .list();

                listPhone = session.createQuery("select phone, count(*) from Tab3 where recitime > :startTime and recitime<= :endTime and type >= 0 group by phone order by count(*) desc")
                        .setParameter("startTime", startTime)
                        .setParameter("endTime", endTime)
                        .setMaxResults(15)
                        .list();
            }
        }

        for (int i = 0; i < listMap.size(); i++) {
            HashMap cop = new HashMap();
            cop.put("content", ((Object[]) listMap.get(i))[0]);
            cop.put("lng", ((Object[]) listMap.get(i))[1]);
            cop.put("lat", ((Object[]) listMap.get(i))[2]);
            cop.put("type", ((Object[]) listMap.get(i))[3]);
            box.add(cop);
            int index = Integer.parseInt(((Object[]) listMap.get(i))[3].toString());
            if (index >= 0) {
                bars[index] += 1;
            }
        }

        for (int i = 0; i < listPhone.size(); i++) {
            HashMap cop = new HashMap();
            cop.put("name", ((Object[]) listPhone.get(i))[0]);
            cop.put("value", ((Object[]) listPhone.get(i))[1]);
            boxPhone.add(cop);
        }

        HashMap json = new HashMap();
        json.put("maps", box);
        json.put("phone", boxPhone);

        HashMap info = new HashMap();
        info.put("num", listMap.size());
        info.put("stime", stime);
        info.put("etime", etime);
        json.put("area", info);

        json.put("bars", bars);

        util.closeSession(session);

        ObjectMapper mapper = new ObjectMapper();

        String res = mapper.writeValueAsString(json);

        inputStream = new ByteArrayInputStream(res.getBytes("UTF-8"));

        System.out.println(res);

        return SUCCESS;
    }
}