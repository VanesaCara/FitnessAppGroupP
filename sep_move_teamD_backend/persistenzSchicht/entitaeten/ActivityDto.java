package com.example.sep_moove_backend.persistenzSchicht.entitaeten;
import java.time.ZonedDateTime;

public class ActivityDto {
    private Long id;

    private String activityName;
    private String activityType;
    private ZonedDateTime dateTime;
    private double distance;
    private double elevation;
    private double averageSpeed;
    private double kcal;
    private long time ;

    // Getters and setters

    public String getActivityName() {
        return activityName;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public ZonedDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(ZonedDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getElevation() {
        return elevation;
    }

    public void setElevation(double elevation) {
        this.elevation = elevation;
    }

    public double getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(double averageSpeed) {
        this.averageSpeed = averageSpeed;
    }

    public double getKcal() {
        return kcal;
    }

    public Long getid() {
        return id;
    }

    public void setid(Long id) {
        this.id = id;
    }

    public void setKcal(double kcal) {
        this.kcal = kcal;
    }
}

