package zh.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zh.dao.IContent;
import zh.pojo.Content;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by OCEAN on 2017/7/18.
 */

@Service
public class ContentService {

    @Autowired(required = false)
    IContent contentDao;

    private List<Content> getContentsByPhoneTypeList(int start, int end, String phone, int type) {
        List<Content> contents = contentDao.getContentsByPhoneType(start, end, phone, type);
        return contents;
    }

    private List<Content> getContentsByTypeList(int start, int end, int type) {
        List<Content> contents = contentDao.getContentsByType(start, end, type);
        return contents;
    }

    private List<Content> getContentsByPhoneList(int start, int end, String phone) {
        List<Content> contents = contentDao.getContentsByPhone(start, end, phone);
        return contents;
    }

    private List<Content> getContentsList(int start, int end) {
        List<Content> contents = contentDao.getContents(start, end);
        return contents;
    }

    public String getContents(int start, int end, String phone, int type) {
        List box = new ArrayList();

        List<Content> contents;// 发送方号码

        if (type >= 0) {
            if (phone == null) {
                contents = getContentsByTypeList(start, end, type);
            } else {
                contents = getContentsByPhoneTypeList(start, end, phone, type);
            }
        } else {
            if (phone == null) {
                contents = getContentsList(start, end);
            } else {
                contents = getContentsByPhoneList(start, end, phone);
            }
        }

        for (Content item : contents) {
            HashMap cop = new HashMap();
            cop.put("content", item.getContent());
            cop.put("num", item.getNum());
            cop.put("type", item.getType());
            box.add(cop);
        }

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
