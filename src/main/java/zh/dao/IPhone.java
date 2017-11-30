package zh.dao;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import zh.pojo.Phone;

import java.util.List;

/**
 * Created: OCEAN on 2017/7/19
 * Email: oceanstation@163.com
 * Description:
 */
@MapperScan
public interface IPhone {
    List<Phone> getPhonesByType(@Param("startTime") int startTime, @Param("endTime") int endTime, @Param("type") int type);
    List<Phone> getPhones(@Param("startTime") int startTime, @Param("endTime") int endTime);
}
