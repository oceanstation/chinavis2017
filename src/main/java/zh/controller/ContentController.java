package zh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import zh.service.ContentService;

/**
 * Created by OCEAN on 2017/7/18.
 */

@Controller
@RequestMapping("/api")
public class ContentController {
    @Autowired
    @Qualifier("contentService")
    private ContentService contentService;

    @RequestMapping(value = "/content", method = RequestMethod.GET, produces = "text/plain;charset=UTF-8")
    @ResponseBody
    public String getContent(int startTime, int endTime, String phone, int type) {
        return contentService.getContents(startTime, endTime, phone, type);
    }
}
