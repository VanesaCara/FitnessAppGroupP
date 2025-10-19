package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityPhoto;
import com.example.sep_moove_backend.serviceSchicht.ActivityPhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/photos")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityPhotoController {

    @Autowired
    private ActivityPhotoService activityPhotoService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("activityId") Long activityId,
            @RequestParam("caption") String caption,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("photo") MultipartFile photo) {

        try {
            byte[] photoData = photo.getBytes();
            ActivityPhoto savedPhoto = activityPhotoService.savePhoto(activityId, caption, latitude, longitude, photoData);
            return ResponseEntity.ok(Map.of("message", "Photo uploaded successfully", "photoId", savedPhoto.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error while uploading photo"));
        }
    }


    @GetMapping("/{activityId}")
    public ResponseEntity<List<Map<String, Object>>> getPhotosByActivity(@PathVariable Long activityId) {
        List<Map<String, Object>> photos = activityPhotoService.getPhotoMetadataByActivityId(activityId);
        return ResponseEntity.ok(photos);
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<?> deletePhoto(@PathVariable Long photoId) {
        try {
            activityPhotoService.deletePhoto(photoId);
            return ResponseEntity.ok(Map.of("message", "Photo deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<byte[]> getPhotoById(@PathVariable Long photoId) {
        try {
            byte[] photoData = activityPhotoService.getPhotoDataById(photoId);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(photoData);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }


}
