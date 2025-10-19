package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityType;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AchievementsService {

    @Autowired
    private ActivityRepository activityRepository;

    public List<String> getAchievementsForUser(Long userId) {
        List<Activity> activities = activityRepository.findByNutzerId(userId);
        Set<String> achievements = new HashSet<>();


        double totalWalkingDistance = 0;
        double totalRunningDistance = 0;
        double totalHikingDistance = 0;
        double totalCyclingDistance = 0;

        for (Activity activity : activities) {
            double distance = activity.getDistance() / 1000.0; // m in km
            ActivityType type = activity.getActivityType();

            // Einzelne
            switch (type) {
                case Spazieren:
                    if (distance >= 2 && !achievements.contains("/Bilder/Erfolge/walkTwo.png")) {
                        achievements.add("/Bilder/Erfolge/walkTwo.png");
                    }
                    if (distance >= 5 && !achievements.contains("/Bilder/Erfolge/walkFive.png")) {
                        achievements.add("/Bilder/Erfolge/walkFive.png");
                    }
                    totalWalkingDistance += distance;
                    break;
                case Laufen:
                    if (distance >= 5 && !achievements.contains("/Bilder/Erfolge/runFive.png")) {
                        achievements.add("/Bilder/Erfolge/runFive.png");
                    }
                    if (distance >= 10 && !achievements.contains("/Bilder/Erfolge/runTen.png")) {
                        achievements.add("/Bilder/Erfolge/runTen.png");
                    }
                    totalRunningDistance += distance;
                    break;
                case Wandern:
                    if (distance >= 10 && !achievements.contains("/Bilder/Erfolge/hikeTen.png")) {
                        achievements.add("/Bilder/Erfolge/hikeTen.png");
                    }
                    if (distance >= 20 && !achievements.contains("/Bilder/Erfolge/hikeTwenty.png")) {
                        achievements.add("/Bilder/Erfolge/hikeTwenty.png");
                    }
                    totalHikingDistance += distance;
                    break;
                case Radfahren:
                    if (distance >= 50 && !achievements.contains("/Bilder/Erfolge/bycicleFifty.png")) {
                        achievements.add("/Bilder/Erfolge/bycicleFifty.png");
                    }
                    if (distance >= 100 && !achievements.contains("/Bilder/Erfolge/bycicleHundred.png")) {
                        achievements.add("/Bilder/Erfolge/bycicleHundred.png");
                    }
                    totalCyclingDistance += distance;
                    break;
            }
        }

        // Gesamte
        if (totalWalkingDistance >= 100) achievements.add("/Bilder/Erfolge/walkHundred.png");
        if (totalRunningDistance >= 50) achievements.add("/Bilder/Erfolge/runFifty.png");
        if (totalHikingDistance >= 100) achievements.add("/Bilder/Erfolge/hikeHundred.png");
        if (totalCyclingDistance >= 500) achievements.add("/Bilder/Erfolge/bycicleFiveHundred.png");

        return achievements.stream().toList();
    }
}
