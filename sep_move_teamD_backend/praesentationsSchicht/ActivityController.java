package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityDto;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivitySummaryDto;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.serviceSchicht.ActivityService;
import com.example.sep_moove_backend.serviceSchicht.NutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "http://localhost:3000")
public class
ActivityController {

    @Autowired
    private ActivityService activityService;
    @Autowired
    private NutzerService nutzerService;


    @GetMapping("/{userId}/activitieslist")
    public List<ActivityDto> getActivitiesByUser(@PathVariable Long userId) {
        return activityService.getActivitiesByUser(userId);  // Excludes track details
    }

    @GetMapping("/summary/{userId}")
    public ActivitySummaryDto getActivitySummary(@PathVariable Long userId) {
        // Fetch activities for the user by their ID
        List<Activity> activities = activityService.getActivitiesByUserId(userId);

        // Check if any activities were found
        if (activities == null || activities.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No activities found for user with ID: " + userId);
        }

        // Calculate and return the activity summary
        return activityService.getActivitySummary(activities);
    }

    @GetMapping("/{userId}/activitieslistOfOtherUser")
    public List<ActivityDto> getActivitiesOfOtherUsers(@PathVariable Long userId) {
        return activityService.getActivitiesOfOtherUsers(userId);  // Excludes track details
    }
    @GetMapping("/getActivity/{acitvityId}")
    public ResponseEntity<Map<String, Object>> getActivityById(@PathVariable Long acitvityId)
    {
        Optional <Activity> oactivity = activityService.getActivityById(acitvityId);
        if (!oactivity.isPresent())
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Keine Aktivität mit der ID : " + acitvityId);
        }
        Activity activity = oactivity.get();

        Map<String, Object> response = new HashMap<>();
        response.put("activityName", activity.getActivityName());
        response.put("activityType", activity.getActivityType());
        response.put("distance", activity.getDistance());
        response.put("duration", activity.getTime());
        response.put("averageSpeed", activity.getAverageSpeed());
        response.put("elevation", activity.getElevation());
        response.put("kcal", activity.getKcal());

        List<Map<String, Double>> trackDaten = activity.getActivityTracks().stream().map(activityTrack -> Map.of(
                "latitude", activityTrack.getLatitude(),
                "longitude", activityTrack.getLongitude(),
                "altitude", activityTrack.getAltitude()
                 )).toList();
        response.put("trackData", trackDaten);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {
        List<Nutzer> alleNutzer = nutzerService.getAlleNutzer();  // Daten aus der DB abrufen
        return alleNutzer.stream()//stream, um einfacher mit der Liste zu arbeiten
                .map(nutzer -> {
                    List<Activity> activities = activityService.getActivitiesByUserId(nutzer.getId()); //für jeden Nutzer eine Liste von Aktivitäten abrufen
                    ActivitySummaryDto summary = activityService.getActivitySummary(activities); // Zusammenfassung der Aktivitäten erstellen

                    // Benutzername und aggregierte Daten kombinieren
                    Map<String, Object> leaderboardEntry = new HashMap<>(); //<key, value>
                    leaderboardEntry.put("username", nutzer.getNutzername());
                    leaderboardEntry.put("totalActivities", summary.getTotalActivities());
                    leaderboardEntry.put("totalDuration", summary.getTotalDuration());
                    leaderboardEntry.put("totalDistance", summary.getTotalDistance());
                    leaderboardEntry.put("totalKcal", summary.getTotalKcal());
                    leaderboardEntry.put("totalElevation", summary.getTotalElevation());
                    leaderboardEntry.put("averageSpeed", summary.getAverageSpeed());
                    leaderboardEntry.put("maxAverageSpeed", summary.getMaxAverageSpeed());
                    leaderboardEntry.put("totalLikes", summary.getTotalLikes());
                    return leaderboardEntry;
                })
                .sorted((a, b) -> Integer.compare((int) b.get("totalActivities"), (int) a.get("totalActivities")))
                .collect(Collectors.toList());
    }
    @GetMapping("/{nutzerId}/getSocialFeedAdmin")
    public ResponseEntity<List<Map<String, Object>>> getSocialFeedAdmin(@PathVariable Long nutzerId) {

        List<Activity> aktivitaeten = activityService.getSocialfeedAdmin(nutzerId);


        List<Map<String, Object>> socialfeed = aktivitaeten.stream().map(activity ->
        {
            Map<String, Object> aktivitaetsDaten = new HashMap<>();

            aktivitaetsDaten.put("nutzername", activity.getNutzer().getNutzername());
            aktivitaetsDaten.put("id", activity.getId());
            aktivitaetsDaten.put("name", activity.getActivityName());
            aktivitaetsDaten.put("type", activity.getActivityType());
            aktivitaetsDaten.put("distance", activity.getDistance());
            aktivitaetsDaten.put("duration", activity.getTime());
            //aktivitaetsDaten.put("averageSpeed", activity.getAverageSpeed());
            aktivitaetsDaten.put("elevation", activity.getElevation());
            aktivitaetsDaten.put("kcal", activity.getKcal());


            return aktivitaetsDaten;
        }).toList();

        return ResponseEntity.ok(socialfeed);
    }
    @GetMapping("/{nutzerId}/socialFeed")
    public ResponseEntity<List<Map<String, Object>>> getSocialFeed(@PathVariable Long nutzerId) {

        List<Map<String, Object>> socialFeed = new ArrayList<>();
        List<Activity> eigeneAktivitaeten = activityService.getEigeneAktivitaeten(nutzerId);
        eigeneAktivitaeten.forEach(activity -> socialFeed.add(Activity2Map(activity, "Eigen")));
        List<Activity> oeffentlicheAktivitaeten = activityService.getOeffentlicheAktivitaeten(nutzerId);
        oeffentlicheAktivitaeten.forEach(activity -> socialFeed.add(Activity2Map(activity, "Öffentlich")));
        List<Activity> freundeAktivitaeten = activityService.getFreundeAktivitaeten(nutzerId);
        freundeAktivitaeten.forEach(activity -> socialFeed.add(Activity2Map(activity, "Freund")));
        return ResponseEntity.ok(socialFeed);
    }

    private Map<String, Object> Activity2Map(Activity activity, String art) {
        Map<String, Object> activityData = new HashMap<>();
        activityData.put("nutzername", activity.getNutzer().getNutzername());
        activityData.put("id", activity.getId());
        activityData.put("name", activity.getActivityName());
        activityData.put("type", activity.getActivityType());
        activityData.put("distance", activity.getDistance());
        activityData.put("time", activity.getTime());
        activityData.put("kcal", activity.getKcal());
        activityData.put("elevation", activity.getElevation());
        activityData.put("sichtbar", activity.getVisibility());
        activityData.put("art", art);

        return activityData;
}




}


