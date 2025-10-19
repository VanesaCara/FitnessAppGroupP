package com.example.sep_moove_backend.serviceSchicht;



import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;


@Service
public class FriendsListService {



    @Autowired
    FriendRequestService friendRequestService ;
    @Autowired
    NutzerRepository userRepository ;


    // Neuer CODE
    @Transactional
    public void friendRequestAccepted(Long senderId, Long receiverId) {
        Nutzer sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        Nutzer receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Entferne die Freundschaftsanfrage aus den jeweiligen Listen
        receiver.getReceivedFriendRequests().remove(sender);
        sender.getSentFriendRequests().remove(receiver); //theoretisch unnötig aber für Konsistenz und Datenbankverwaltung drin

        // Füge die Nutzer in die Freundeslisten hinzu
        sender.getFriendList().add(receiver);
        receiver.getFriendList().add(sender);

        // Speichere die Änderungen in der Datenbank
        userRepository.save(sender);
        userRepository.save(receiver);
    }


    private Nutzer findUserById(Long userId) {

        return userRepository.findById(userId).orElse(null);
    }
    public List<Nutzer> findFriends(Long userId) {
        List<Nutzer> userList;

        userList = userRepository.findById(userId)
                .map(userRepository::findByFriendList)
                .orElse(Collections.emptyList());

        return userList;
    }
    public Nutzer getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }
    public Nutzer getUserByEmail(String email) {
        return friendRequestService.findUserByEmail(email);
    }

    public void removeFriend(Long userID, Long friendId) {
        Nutzer user = userRepository.findById(userID).orElse(null);
        Nutzer friend = userRepository.findById(friendId).orElse(null);
        if(user!=null) {
            user.getFriendList().remove(friend);
            friend.getFriendList().remove(user);
            userRepository.save(friend);
            userRepository.save(user);
        }

    }
    @Transactional
    public void updateFriendListPrivacy(Long userId, boolean isPrivate) {
        Nutzer user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setFriendListPrivate(isPrivate);
            userRepository.save(user);
        }}


}
