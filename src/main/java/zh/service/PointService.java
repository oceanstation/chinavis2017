package zh.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zh.dao.IPhone;
import zh.dao.IPoint;
import zh.pojo.Phone;
import zh.pojo.Point;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created: OCEAN on 2017/7/18
 * Email: oceanstation@163.com
 * Description:
 */
@Service
public class PointService {

    @Autowired(required = false)
    IPoint pointDao;

    @Autowired(required = false)
    IPhone phoneDao;

    private List<Point> getPointsList(int start, int end) {
        return pointDao.getPoints(start, end);
    }

    private List<Point> getPointsByTypeList(int start, int end, int type) {
        return pointDao.getPointsByType(start, end, type);
    }

    private List<Phone> getPhonesList(int start, int end) {
        return phoneDao.getPhones(start, end);
    }

    private List<Phone> getPhonesByTypeList(int start, int end, int type) {
        return phoneDao.getPhonesByType(start, end, type);
    }

    public String getPoints(int start, int end, int type) {
        int[] bars = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        List boxPoint = new ArrayList();
        List boxPhone = new ArrayList();
        List<Point> points;// 地图上的点
        List<Phone> phones;// 发送方号码
        HashMap box = new HashMap();

        if (type >= 0) {
            points = getPointsByTypeList(start, end, type);
            phones = getPhonesByTypeList(start, end, type);

        } else {
            points = getPointsList(start, end);
            phones = getPhonesList(start, end);
        }

        for (Point item : points) {
            HashMap cop = new HashMap();
            cop.put("content", item.getContent());
            cop.put("lng", item.getLng());
            cop.put("lat", item.getLat());
            cop.put("type", item.getType());
            boxPoint.add(cop);

            // 统计各个分类的数量
            int index = item.getType();
            if (index >= 0) {
                bars[index] += 1;
            }
        }

        for (Phone item : phones) {
            HashMap cop = new HashMap();
            cop.put("name", item.getPhone());
            cop.put("value", item.getNum());
            boxPhone.add(cop);
        }

        // int整数相乘溢出
        Date stime = new Date((long) start * 1000);
        Date etime = new Date((long) end * 1000);
        HashMap info = new HashMap();
        info.put("num", points.size());
        info.put("stime", stime);
        info.put("etime", etime);

        box.put("maps", boxPoint);
        box.put("phone", boxPhone);
        box.put("area", info);
        box.put("bars", bars);

        ObjectMapper mapper = new ObjectMapper();
        String res = null;
        try {
            res = mapper.writeValueAsString(box);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return res;
    }
}
