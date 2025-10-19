package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.serviceSchicht.AchievementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "http://localhost:3000")
public class AchievementsController {

    @Autowired
    private AchievementsService achievementsService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getAchievements(@PathVariable Long userId) {
        List<String> achievements = achievementsService.getAchievementsForUser(userId);
        return ResponseEntity.ok(achievements);
    }
}
