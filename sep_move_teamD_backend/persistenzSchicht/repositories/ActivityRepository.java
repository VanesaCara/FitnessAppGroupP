package com.example.sep_moove_backend.persistenzSchicht.repositories;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByNutzerId(Long nutzerId);

    List<Activity> findByNutzer_IdAndVisibilityTrue(Long nutzerId);

    List<Activity> findByVisibilityTrueAndNurFreundeFalse();

    List<Activity> findByNutzerIdInAndNurFreundeTrue(List <Long> freundeIds);

    List<Activity> findByNutzer_IdAndVisibilityFalseAndNurFreundeFalse(Long nutzerId);

}

