package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface NutzerRepository extends JpaRepository<Nutzer,Long> {
    Optional<Nutzer> findByEmail(String email);

    Optional<Nutzer> findByNutzername(String nutzer);
    //findbyId wird bereits von der JPARepository bereitgestellt, müssen wir hier also nicht deklarieren


    @Transactional
    default void saveFriendRequest(String receiverEmail) {
        Optional<Nutzer> receiver = findByEmail(receiverEmail);
    }

    @Modifying
    @Transactional
    @Query("UPDATE Nutzer u SET u.isFriendListPrivate = :isPrivate WHERE u.id = :userId")
    void updateFriendListPrivacyById(@Param("userId") Long userId, @Param("isPrivate") boolean isPrivate);

    List<Nutzer> findByFriendList(Nutzer user);

}