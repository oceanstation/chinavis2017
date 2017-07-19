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
 * Created by OCEAN on 2017/7/18.
 */

@Service
public class PointService {

    @Autowired(required = false)
    IPoint pointDao;

    @Autowired(required = false)
    IPhone phoneDao;

    private List<Point> getPointsList(int start, int end) {
        List<Point> positions = pointDao.getPoints(start, end);
        return positions;
    }

    private List<Point> getPointsByTypeList(int start, int end, int type) {
        List<Point> positions = pointDao.getPointsByType(start, end, type);
        return positions;
    }

    private List<Phone> getPhonesList(int start, int end) {
        List<Phone> phones = phoneDao.getPhones(start, end);
        return phones;
    }

    private List<Phone> getPhonesByTypeList(int start, int end, int type) {
        List<Phone> phones = phoneDao.getPhonesByType(start, end, type);
        return phones;
    }

    public String getPoints(int start, int end, int type) {
        List boxPoint = new ArrayList();
        List boxPhone = new ArrayList();
        int[] bars = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

        List<Point> points;// 地图上的点
        List<Phone> phones;// 发送方号码
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

        HashMap json = new HashMap();
        json.put("maps", boxPoint);
        json.put("phone", boxPhone);
        json.put("area", info);
        json.put("bars", bars);

        ObjectMapper mapper = new ObjectMapper();
        String res = null;
        try {
            res = mapper.writeValueAsString(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return res;
    }
}
