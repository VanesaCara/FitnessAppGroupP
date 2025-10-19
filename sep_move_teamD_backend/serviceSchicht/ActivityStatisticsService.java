package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityTrack;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;


@Service
public class ActivityStatisticsService {

    public double getKcal(Activity activity, ActivityTrack p1, ActivityTrack p2, double weight) {

        double MET = 0;
        long time = time(p1, p2);

        switch(activity.getActivityType()){
            case Laufen:
                MET = 8.8;
                break;
            case Radfahren:
                MET = 5.3;
                break;
            case Spazieren:
                MET = 7.5;
                break;
            case Wandern:
                MET = 3;
                break;
        }
        return time * (MET * 3.5 * weight) / 12000;
    }

    private double distance(ActivityTrack p1, ActivityTrack p2) {
        final int R = 6371000;
        double latDistance = Math.toRadians(p2.getLatitude() - p1.getLatitude());
        double lonDistance = Math.toRadians(p2.getLongitude() - p1.getLongitude());

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(p1.getLatitude())) * Math.cos(Math.toRadians(p2.getLatitude())) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double elevation(ActivityTrack p1, ActivityTrack p2) {
        if(p2.getAltitude() - p1.getAltitude() >= 0){
            return p2.getAltitude() - p1.getAltitude();
        }
        return 0;
    }

    private long time(ActivityTrack p1, ActivityTrack p2){
        return Duration.between(p1.getTimestamp(), p2.getTimestamp()).getSeconds();
    }

    public double distanceBetween(int point1, int point2, Activity activity) {
        double dist = 0;
        for(int i = point1; i < point2; i++){
            dist += distance(activity.getActivityTracks().get(i),activity.getActivityTracks().get(i+1));
        }
        return dist;
    }

    public long timeBetween(int point1, int point2, Activity activity) {
        return time(activity.getActivityTracks().get((int) point1),activity.getActivityTracks().get((int) point2));
    }

    public double elevationBetween(int point1, int point2, Activity activity) {
        double elev = 0;
        for(int i = point1; i < point2; i++){
            elev += elevation(activity.getActivityTracks().get(i),activity.getActivityTracks().get(i+1));
        }
        return elev;
    }

    public double kmhBetween(int point1, int point2, Activity activity) {
        long time = timeBetween(point1, point2, activity);
        double distance = distanceBetween(point1, point2, activity);

        return (distance / time) * 3.6;
    }

    public List<double[]> getHeightPointsLinear(Activity activity){
        List<double[]> linears = new ArrayList<>();


        for(int i = 0; i < activity.getActivityTracks().size(); i++){
            double[] temp = new double[2];
            temp[0] = time(activity.getActivityTracks().getFirst(), activity.getActivityTracks().get(i));
            temp[1] = activity.getActivityTracks().get(i).getAltitude();
            linears.add(temp);
        }
        return linears;
    }

}