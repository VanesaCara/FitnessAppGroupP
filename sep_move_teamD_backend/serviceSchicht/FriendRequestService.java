package com.example.sep_moove_backend.serviceSchicht;


import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class FriendRequestService {

    @Autowired
    private final NutzerRepository userRepository;
    private final FriendRequestEmailService friendRequestEmailService;



    public FriendRequestService(NutzerRepository userRepository, FriendRequestEmailService friendRequestEmailService) {
        this.userRepository = userRepository;
        this.friendRequestEmailService= friendRequestEmailService;

    }

    public Nutzer findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));
    }



    public void sendFriendRequest(String receiverEmail, Long userId) {

        Nutzer friend = findUserByEmail(receiverEmail);
        Nutzer sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        //  Benutzer sender = userRepository.findById(userBySessionID.getId()).orElse(null);
        // Email senden
        friendRequestEmailService.sendFriendshipRequestEmail(friend, sender);

        // Hinzufügen und Speichern der Daten (Update der Listen)
        sender.getSentFriendRequests().add(friend);
        friend.getReceivedFriendRequests().add(sender);

        // Speichern in DB
        userRepository.save(sender);
        userRepository.save(friend);
    }



    public Set<Nutzer> getFriendRequests(Long userId) {
        Nutzer user = userRepository.findById(userId).orElse(null);
        return user != null ? user.getReceivedFriendRequests() : new HashSet<>();
    }


    public void declineFriendRequest(Long receiverId,  Long userId) {
        Optional<Nutzer> sender1 = userRepository.findById(userId);
        if (!sender1.isPresent()) {
            throw new RuntimeException("Sender not found");
        }
        Nutzer sender = sender1.get();
        Nutzer Reciever = userRepository.findById(receiverId).orElse(null);

        sender.getSentFriendRequests().remove(Reciever);
        userRepository.save(sender);
        Reciever.getReceivedFriendRequests().remove(sender);
        userRepository.save(Reciever);

    }


    public Set<Nutzer> getFriendRequests1(Long userId) {
        Nutzer user = userRepository.findById(userId).orElse(null);
        return user != null ? user.getReceivedFriendRequests() : new HashSet<>();
    }

}
