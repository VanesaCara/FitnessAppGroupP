package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Likes;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.LikesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class LikesService {

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private NutzerRepository nutzerRepository;



    @Autowired
    private NutzerService nutzerService;

    @Transactional
    public void addLike(long activityId, long userId) {
         Nutzer nutzer = nutzerRepository.findById(userId).orElse(null);
       Activity activity = activityRepository.findById(activityId).orElse(null);
        Optional<Likes> existingLike = likesRepository.findByNutzerAndActivity(nutzer, activity);
        if (existingLike.isPresent()) {
            throw new IllegalStateException("Nutzer kann die activity nicht mehrfach liken.");
        }





        Likes like = new Likes();
        like.setNutzer(nutzer);
        like.setActivity(activity);

        likesRepository.save(like);
    }


    @Transactional
    public void removeLike(long activityId, long userId) {
        Nutzer nutzer = nutzerRepository.findById(userId).orElse(null);
        Activity activity = activityRepository.findById(activityId).orElse(null);
        Optional<Likes> like = likesRepository.findByNutzerAndActivity(nutzer, activity);

        if (like.isEmpty()) {
            throw new IllegalStateException("Es exisitiert kein Like zum entfernen.");
        }

        likesRepository.delete(like.get());
    }

    public Long getLikesAmount(long activityId) {

        Activity activity = activityRepository.findById(activityId).orElse(null);
        return likesRepository.countByActivity(activity);
    }


     public Long getLikesAmountByUser (Long userId){

        Long total = likesRepository.getTotalLikesByUserId(userId);
         System.out.println("LikesAmount" + total);
        return total;


     }
    public boolean getLikedStatus(long activityId, long userId) {
        Nutzer nutzer = nutzerRepository.findById(userId).orElse(null);
        Activity activity = activityRepository.findById(activityId).orElse(null);
        return likesRepository.findByNutzerAndActivity(nutzer, activity).isPresent();
    };
}
