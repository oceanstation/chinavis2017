package model;

/**
 * Created by OCEAN on 2017/5/20.
 */
public class Tab4 implements java.io.Serializable {
    private int id;
    private String md5;
    private String content;
    private String phone;
    private int connectime;
    private int recitime;
    private float lng;
    private float lat;
    private int type;

    public Tab4() {
    }

    public Tab4(int id, String md5, String content, String phone, int connectime, int recitime, float lng, float lat, int type) {
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public int getConnectime() {
        return connectime;
    }

    public void setConnectime(int connectime) {
        this.connectime = connectime;
    }

    public int getRecitime() {
        return recitime;
    }

    public void setRecitime(int recitime) {
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

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
