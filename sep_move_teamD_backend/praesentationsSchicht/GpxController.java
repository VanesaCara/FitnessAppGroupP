
package com.example.sep_moove_backend.praesentationsSchicht;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityType;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import com.example.sep_moove_backend.serviceSchicht.ActivityService;
import com.example.sep_moove_backend.serviceSchicht.ActivityStatisticsService;
import com.example.sep_moove_backend.serviceSchicht.GpxService;
import com.example.sep_moove_backend.serviceSchicht.NutzerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import java.util.Map;



@RestController
//Diese Klasse ist ein direkter Ansprechpartner für Schnittstellen
@RequestMapping("/gpx")
//bildet den Pfad zu diesem Komponent, zsm mit dem localhost:8080
@CrossOrigin(origins = "http://localhost:3000/")
//?(Ermöglicht Kommunikation zu der spezifizierten Schnittstelle, wenn es Probleme mit Cors gibt)
public class GpxController {

    @Autowired
    private GpxService gpxService;
    @Autowired
    private ActivityStatisticsService activityStatisticsService;

    @Autowired
    private NutzerService nutzerService;
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityService activityService;


    @PostMapping("/validate")
    //  d. h. folgende Funktion ist über Schnittstellen ansprechbar, wenn man "/validate an dem Pfad der Komponente anhängt.
    public ResponseEntity<?> validateGPX(@RequestParam("file") MultipartFile file) {
        boolean isValid = gpxService.validateGPX(file);
        return ResponseEntity.ok().body(Map.of("valid", isValid));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadGPX(@RequestParam("file") MultipartFile file,
                                       @RequestParam("activityDetails") String activityDetailsJson,

                                       @RequestParam("nutzerId") long nutzerId){

        ObjectMapper mapper = new ObjectMapper();
        Activity activityDetails;
        try {
            activityDetails = mapper.readValue(activityDetailsJson, Activity.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(400).body("Invalid activity details format.");
        }
        Activity activity = gpxService.parseGPX(file, activityDetails);
        activity.setKcal(activityStatisticsService.getKcal(activity, activity.getActivityTracks().getFirst(), activity.getActivityTracks().getLast(), nutzerService.getNutzerById(nutzerId).get().getGewicht()));

        if (activity != null) {

            Activity savedActivity = activityService.createActivity(nutzerId, activityDetails);

            if (savedActivity != null) {
                return ResponseEntity.ok("Activity successfully uploaded.");
            } else {
                return ResponseEntity.status(500).body("Failed to associate activity with the user.");
            }
        }
        else                    {
            return ResponseEntity.status(500).body("Failed to parse GPX file.");
        }
    }

}
