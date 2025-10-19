package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

public class ActivitySummaryDto {

    private int totalActivities;
    private double totalDuration;  // in hours
    private double totalDistance;  // in kilometers
    private double totalKcal;      // in kcal
    private double totalElevation; // in meters
    private double averageSpeed;   // in km/h
    private double maxAverageSpeed; // in km/h
    private long totalLikes;

    // Constructor
    public ActivitySummaryDto(int totalActivities, double totalDuration, double totalDistance,
                              double totalKcal, double totalElevation, double averageSpeed, double maxAverageSpeed, long totalLikes) {
        this.totalActivities = totalActivities;
        this.totalDuration = totalDuration;
        this.totalDistance = totalDistance;
        this.totalKcal = totalKcal;
        this.totalElevation = totalElevation;
        this.averageSpeed = averageSpeed;
        this.maxAverageSpeed = maxAverageSpeed;
        this.totalLikes = totalLikes;
    }

    // Getters and Setters
    public int getTotalActivities() {
        return totalActivities;
    }

    public double getTotalDuration() {
        return totalDuration;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public double getTotalKcal() {
        return totalKcal;
    }

    public double getTotalElevation() {
        return totalElevation;
    }

    public double getAverageSpeed() {
        return averageSpeed;
    }

    public double getMaxAverageSpeed() {
        return maxAverageSpeed;
    }

    public long getTotalLikes() {return totalLikes;}
}
