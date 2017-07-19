package zh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import zh.service.PointService;

/**
 * Created by OCEAN on 2017/7/18.
 */

@Controller
@RequestMapping("/api")
public class PointController {
    @Autowired
    @Qualifier("pointService")
    private PointService pointService;

    @RequestMapping(value = "/position", method = RequestMethod.GET, produces = "text/plain;charset=UTF-8")
    @ResponseBody
    public String getPoint(int startTime, int endTime, int type) {
        return pointService.getPoints(startTime, endTime, type);
    }
}
