package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityPhoto;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityPhotoRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityPhotoService {

    @Autowired
    private ActivityPhotoRepository activityPhotoRepository;

    @Autowired
    private ActivityRepository activityRepository;


    private final String photoDirectory = "aktivitaetsfotos";


    public ActivityPhoto savePhoto(Long activityId, String caption, double latitude, double longitude, byte[] photoData) throws IOException {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (activityPhotoRepository.findByActivityIdAndLatitudeAndLongitude(activityId, latitude, longitude).isPresent()) {
            throw new RuntimeException("Ein Foto für diese Koordinate existiert bereits.");
        }


        Path photoStoragePath = Paths.get(photoDirectory);
        if (!Files.exists(photoStoragePath)) {
            Files.createDirectories(photoStoragePath);
        }


        String fileName = "photo_" + System.currentTimeMillis() + ".jpg";
        Path filePath = photoStoragePath.resolve(fileName);
        Files.write(filePath, photoData);


        ActivityPhoto activityPhoto = new ActivityPhoto();
        activityPhoto.setFilePath(photoStoragePath.resolve(fileName).toString());
        activityPhoto.setCaption(caption);
        activityPhoto.setLatitude(latitude);
        activityPhoto.setLongitude(longitude);
        activityPhoto.setActivity(activity);

        return activityPhotoRepository.save(activityPhoto);
    }


    public List<ActivityPhoto> getPhotosByActivityId(Long activityId) {
        return activityPhotoRepository.findByActivityId(activityId);
    }

    public void deletePhoto(Long photoId) {
        ActivityPhoto photo = activityPhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
        try {
            Files.deleteIfExists(Paths.get(photo.getFilePath()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        activityPhotoRepository.delete(photo);
    }

    public List<Map<String, Object>> getPhotoMetadataByActivityId(Long activityId) {
        return activityPhotoRepository.findByActivityId(activityId)
                .stream()
                .map(photo -> {
                    Map<String, Object> photoData = new HashMap<>();
                    photoData.put("id", photo.getId());
                    photoData.put("caption", photo.getCaption());
                    photoData.put("latitude", photo.getLatitude());
                    photoData.put("longitude", photo.getLongitude());
                    return photoData;
                })
                .toList();
    }
    public byte[] getPhotoDataById(Long photoId) throws IOException {
        ActivityPhoto photo = activityPhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
        return Files.readAllBytes(Paths.get(photo.getFilePath()));
    }




}
