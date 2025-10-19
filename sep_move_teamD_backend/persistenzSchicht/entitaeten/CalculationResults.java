package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

public class CalculationResults {
    private double distance;
    private long time;
    private double elevation;
    private double kcal;
    private double kmh;

    public CalculationResults(double distance, long time, double elevation, double kcal, double kmh) {
        this.distance = distance;
        this.time = time;
        this.elevation = elevation;
        this.kcal = kcal;
        this.kmh = kmh;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getKmh() {
        return kmh;
    }

    public void setKmh(double kmh) {
        this.kmh = kmh;
    }

    public double getKcal() {
        return kcal;
    }

    public void setKcal(double kcal) {
        this.kcal = kcal;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public double getElevation() {
        return elevation;
    }

    public void setElevation(double elevation) {
        this.elevation = elevation;
    }
}