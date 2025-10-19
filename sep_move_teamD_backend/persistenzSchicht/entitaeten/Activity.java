package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aid;

    @Column(nullable = false)
    private String activityName;
    //sollte vlt. Unique sein
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType activityType;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "activity_id")
    private List<ActivityTrack> activityTracks;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private Nutzer nutzer; // Reference to the user who created this activity

    @Lob
    @Column(name = "gpx_file")
    private byte[] gpxFile;

    @Column(nullable = false)
    private boolean visibility;

    // New columns for calculated fields
    @Column
    private double distance;

    @Column
    private long time;

    @Column
    private double kcal;

    @Column
    private double elevation;

    @Column
    private double averageSpeed; // km/h

    @Column
    private ZonedDateTime dateTime;

    @Column
    private Boolean nurFreunde = false;




    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();


    // Getters and Setters


    public boolean isNurFreunde() {
        return nurFreunde;
    }

    public void setNurFreunde(Boolean nurFreunde) {
        this.nurFreunde = nurFreunde;
    }

    public Boolean isVisibility() {
        return visibility;
    }

    public Long getAid() {
        return aid;
    }

    public void setAid(Long aid) {
        this.aid = aid;
    }

    public Long getId() {
        return aid;
    }

    public ZonedDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(ZonedDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setId(Long id) {
        this.aid = id;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public List<ActivityTrack> getActivityTracks() {
        return activityTracks;
    }

    public ActivityTrack getFirstTrack() {
        return (activityTracks != null && !activityTracks.isEmpty()) ? activityTracks.get(0) : null;
    }

    public ActivityTrack getLastTrack() {
        return (activityTracks != null && !activityTracks.isEmpty()) ? activityTracks.get(activityTracks.size() - 1) : null;
    }

    public void setActivityTracks(List<ActivityTrack> activityTracks) {
        this.activityTracks = activityTracks;
    }

    public Nutzer getNutzer() {
        return nutzer;
    }

    public void setNutzer(Nutzer nutzer) {
        this.nutzer = nutzer;
    }

    public byte[] getGpxFile() {
        return gpxFile;
    }

    public void setGpxFile(byte[] file) {
        this.gpxFile = file;
    }

    public boolean getVisibility() {
        return visibility;
    }

    public void setVisibility(boolean visibility) {
        this.visibility = visibility;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public double getKcal() {
        return kcal;
    }

    public void setKcal(double kcal) {
        this.kcal = kcal;
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
}
