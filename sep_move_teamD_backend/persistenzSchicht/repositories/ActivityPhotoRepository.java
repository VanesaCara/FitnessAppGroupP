package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ActivityPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityPhotoRepository extends JpaRepository<ActivityPhoto, Long> {
    List<ActivityPhoto> findByActivityId(Long activityId);
    Optional<ActivityPhoto> findByActivityIdAndLatitudeAndLongitude(Long activityId, double latitude, double longitude);
}

