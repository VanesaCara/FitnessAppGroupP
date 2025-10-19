package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.*;

import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private NutzerRepository nutzerRepository;
    @Autowired
    private ActivityStatisticsService activityStatisticsService ;
    @Autowired
    private NutzerService nutzerService;
    @Autowired
    private LikesService likesService;


    public Activity createActivity(Long nutzerId, Activity activity) {
        Nutzer nutzer = nutzerRepository.findById(nutzerId).orElse(null);
        if (nutzer != null) {
            activity.setNutzer(nutzer);
            return activityRepository.save(activity);
        }
        return null;
    }


    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }


    public List<ActivityDto> getActivitiesByUser(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        // Fetch activities from the repository (without tracks)
        List<Activity> activities = activityRepository.findByNutzerId(userId);


        // Map the activities to DTO (excluding tracks)
        return activities.stream()
                .map(this::convertToActivityDto)
                .collect(Collectors.toList());
    }

    // Convert Activity entity to ActivityDto (exclude activity tracks)
    private ActivityDto convertToActivityDto(Activity activity) {
        ActivityDto dto = new ActivityDto();
        dto.setid(activity.getId());
        dto.setActivityName(activity.getActivityName());
        dto.setActivityType(activity.getActivityType().toString());
        dto.setDateTime(activity.getDateTime());
        dto.setDistance(activity.getDistance());
        dto.setElevation(activity.getElevation());
        dto.setAverageSpeed(activity.getAverageSpeed());
        dto.setKcal(activity.getKcal());
        dto.setTime(activity.getTime());
        // No need to include activityTracks in the DTO
        return dto;
    }

    public List<Activity> getActivitiesByUserId(Long userId) {
        return activityRepository.findByNutzerId(userId);
    }

    // Method to get activity summary
    public ActivitySummaryDto getActivitySummary(List<Activity> activities) {
        int totalActivities = 0;
        double totalDuration = 0.0;
        double totalDistance = 0.0;
        double totalKcal = 0.0;
        double totalElevation = 0.0;
        double totalAverageSpeed = 0.0;
        double maxAverageSpeed = 0.0;
        long totalLikes = 0;

        for (Activity activity : activities) {
            totalActivities++;
            totalDuration += (activity.getTime() / 3600.0); // Convert time in seconds to hours
            totalDistance += activity.getDistance();
            totalKcal += activity.getKcal();
            totalElevation += activity.getElevation();
            totalAverageSpeed += activity.getAverageSpeed();
            totalLikes += likesService.getLikesAmount(activity.getId());

            if (activity.getAverageSpeed() > maxAverageSpeed) {
                maxAverageSpeed = activity.getAverageSpeed();
            }
        }

        double avgSpeed = totalActivities > 0 ? totalAverageSpeed / totalActivities : 0.0;

        return new ActivitySummaryDto(
                totalActivities,
                totalDuration,
                totalDistance,
                totalKcal,
                totalElevation,
                avgSpeed,
                maxAverageSpeed,
                totalLikes
        );
    }


        public List<ActivityDto> getActivitiesOfOtherUsers(Long userId) {
            if (userId == null || userId <= 0) {
                throw new IllegalArgumentException("Invalid user ID");
            }

            // Fetch only activities that are visible for the given user
            List<Activity> activities = activityRepository.findByNutzer_IdAndVisibilityTrue(userId);

            // Map to DTO
            return activities.stream()
                    .map(this::convertToActivityDto)
                    .collect(Collectors.toList());
        }
    public List<Activity> getSocialfeedAdmin(Long userId)
    {
        return activityRepository.findAll();

    }
    public List<Activity> getEigeneAktivitaeten(Long nutzerId)
    {
        return activityRepository.findByNutzer_IdAndVisibilityFalseAndNurFreundeFalse(nutzerId);
    }
    public List<Activity> getOeffentlicheAktivitaeten(Long nutzerId)
    {
        return activityRepository.findByVisibilityTrueAndNurFreundeFalse();
    }
    public List<Activity> getFreundeAktivitaeten(Long nutzerId) {
        Nutzer nutzer = nutzerRepository.findById(nutzerId).orElse(null);
        List <Long> freundeIds = nutzer.getFriendList().stream()
                .map(Nutzer::getId)
                .collect(Collectors.toList());
        freundeIds.add(nutzerId);
        return activityRepository.findByNutzerIdInAndNurFreundeTrue(freundeIds);
    }



}


