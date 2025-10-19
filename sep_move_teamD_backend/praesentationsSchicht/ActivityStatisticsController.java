
package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.CalculationResults;
import com.example.sep_moove_backend.serviceSchicht.ActivityService;
import com.example.sep_moove_backend.serviceSchicht.ActivityStatisticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/ActivityStatistics")
public class ActivityStatisticsController {


    private final ActivityStatisticsService activityStatisticsService;
    private final ActivityService activityService;

    public ActivityStatisticsController(ActivityStatisticsService activityStatisticsService, ActivityService activityService) {
        this.activityStatisticsService = activityStatisticsService;
        this.activityService = activityService;
    }



    @GetMapping("/{id}/getSize")
    public int getTrackPointCount(@PathVariable long id) {
        return activityService.getActivityById(id).get().getActivityTracks().size();
    }

   @GetMapping("/{id}/calculate")
    public CalculationResults calculate(@RequestParam int point1, @RequestParam int point2,@PathVariable long id) {
        Activity activity =  activityService.getActivityById(id).get();
        point2 -=1;
        point1 -= 1;

        double distance = activityStatisticsService.distanceBetween(point1, point2, activity);
        long time = activityStatisticsService.timeBetween(point1, point2, activity);
        double elev = activityStatisticsService.elevationBetween(point1, point2, activity);
        double kcal = activityStatisticsService.getKcal(activity, activity.getActivityTracks().get(point1), activity.getActivityTracks().get(point2), activity.getNutzer().getGewicht());
        double kmh = activityStatisticsService.kmhBetween(point1, point2, activity);

        return new CalculationResults(distance, time, elev, kcal, kmh);
    }

    @GetMapping("/{id}/getName")
    public String getName(@PathVariable long id){
        Activity activity = activityService.getActivityById(id).get();
        return activity.getActivityName();
    }

    @GetMapping("/{id}/getType")
    public String getType(@PathVariable long id){
        Activity activity = activityService.getActivityById(id).get();
        return activity.getActivityType().toString();
    }

    @GetMapping("/{id}/getDate")
    public String getDate(@PathVariable long id){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm:ss");

        Activity activity = activityService.getActivityById(id).get();
        return activity.getActivityTracks().getFirst().getTimestamp().format(formatter);
    }

    @GetMapping("/{id}/getDistance")
    public double getDistance(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getDistance();
    }

    @GetMapping("/{id}/getTime")
    public double getTime(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getTime();
    }

    @GetMapping("/{id}/getSpeed")
    public double getSpeed(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getAverageSpeed();
    }

    @GetMapping("/{id}/getHeight")
    public double getHeight(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getElevation();
    }


    @GetMapping("/{id}/getCalories")
    public double getCalories(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getKcal();
    }

    @GetMapping("/{id}/getUser")
    public long getUser(@PathVariable long id){

        Activity activity = activityService.getActivityById(id).get();
        return activity.getNutzer().getId();
    }



   /*  @GetMapping("/{id}/tracks")
    public ResponseEntity<?> getAktivitaetTracks(@PathVariable Long id)
    {
        Optional<Activity> oactivity = activityService.getActivityById(id);
        if(oactivity.isEmpty())
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activity Nr."+id+" wurde nicht gefunden");
        }
        Activity activity = oactivity.get();
        List<Map<String, Object>> tracks = activity.getActivityTracks().stream()
                .map(track -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("timestamp", track.getTimestamp().toString());
                    map.put("altitude", track.getAltitude());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(tracks);
    } */



    @GetMapping("/{id}/heightVisual")
    public List<Map<String, Object>> getHeightVisual(@PathVariable long id){
        Activity activity = activityService.getActivityById(id).get();

        List<double[]> linears = activityStatisticsService.getHeightPointsLinear(activity);

        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < linears.size(); i ++) {
            Map<String, Object> points = new HashMap<>();
            points.put("x", linears.get(i)[0]);
            points.put("y", linears.get(i)[1]);
            data.add(points);
        }

        return data;
    }

}