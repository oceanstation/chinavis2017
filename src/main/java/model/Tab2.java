package model;

/**
 * Created by OCEAN on 2017/5/20.
 */
public class Tab2 implements java.io.Serializable {
    private Integer id;
    private String md5;
    private String content;
    private String phone;
    private String connectime;
    private String recitime;
    private float lng;
    private float lat;
    private Integer type;

    public Tab2() {
    }

    public Tab2(int id, String md5, String content, String phone, String connectime, String recitime, float lng, float lat, int type) {
        this.id = id;
        this.md5 = md5;
        this.content = content;
        this.phone = phone;
        this.connectime = connectime;
        this.recitime = recitime;
        this.lng = lng;
        this.lat = lat;
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getConnectime() {
        return connectime;
    }

    public void setConnectime(String connectime) {
        this.connectime = connectime;
    }

    public String getRecitime() {
        return recitime;
    }

    public void setRecitime(String recitime) {
        this.recitime = recitime;
    }

    public float getLng() {
        return lng;
    }

    public void setLng(float lng) {
        this.lng = lng;
    }

    public float getLat() {
        return lat;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
