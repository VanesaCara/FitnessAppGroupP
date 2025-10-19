package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Likes;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Likes;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikesRepository extends JpaRepository <Likes, Long> {
    Optional<Likes> findById(Long id);

    List<Likes> findByNutzer(Nutzer nutzer);

    List<Likes> findByActivity(Activity activity);

    Optional<Likes> findByNutzerAndActivity (Nutzer nutzer, Activity activity);

    @Modifying
    @Query("DELETE FROM Likes lk WHERE lk.nutzer.id = :userId AND lk.activity.aid = :activityId")
    void deleteByUserIdAndActivityId(@Param("userId") Long userId, @Param("activityId") Long activityId);

    Long countByActivity(Activity activity);
//bei nativeQuery wir die selbe Syntax wie für die DB-Abfragesprache verwendet, hier postgres.

   /*nativeQuery*/ @Query(value = "SELECT COUNT(*) FROM Likes l " +
           "JOIN Activity a ON l.activity.id = a.aid " +
           "WHERE a.nutzer_id = :userId",
           nativeQuery = true)
    Long getTotalLikesByUserId(@Param("userId") Long userId);
}
