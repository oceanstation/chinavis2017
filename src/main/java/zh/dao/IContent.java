package zh.dao;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import zh.pojo.Content;

import java.util.List;

/**
 * Created: OCEAN on 2017/7/19
 * Email: oceanstation@163.com
 * Description:
 */
@MapperScan
public interface IContent {
    List<Content> getContentsByPhoneType(@Param("startTime") int startTime, @Param("endTime") int endTime, @Param("phone") String phone, @Param("type") int type);
    List<Content> getContentsByPhone(@Param("startTime") int startTime, @Param("endTime") int endTime, @Param("phone") String phone);
    List<Content> getContentsByType(@Param("startTime") int startTime, @Param("endTime") int endTime, @Param("type") int type);
    List<Content> getContents(@Param("startTime") int startTime, @Param("endTime") int endTime);
}
