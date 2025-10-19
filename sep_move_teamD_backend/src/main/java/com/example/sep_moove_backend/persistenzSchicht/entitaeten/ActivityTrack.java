package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity
public class ActivityTrack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double latitude;
    private double longitude;
    private double altitude;
    private ZonedDateTime timestamp; // You can store as a long for simplicity
    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    public ActivityTrack(Long id, double latitude, double longitude, double altitude, ZonedDateTime timestamp, Activity activity){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.timestamp = timestamp;
        this.activity = activity;
    }

    public ActivityTrack() {

    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
