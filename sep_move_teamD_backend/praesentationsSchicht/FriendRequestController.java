package com.example.sep_moove_backend.praesentationsSchicht;



import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.serviceSchicht.FriendRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.Set;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/freunde")

public class FriendRequestController {

    private final FriendRequestService friendRequestService;


    public FriendRequestController(FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }


    @PostMapping("/friendRequest/sendFriendRequest")
    public ResponseEntity<String> sendFriendRequest(@RequestParam("requestedEmail") String friendEmail,
                                                    @RequestParam("senderId") Long senderId) {
        friendRequestService. sendFriendRequest(friendEmail, senderId);
        return ResponseEntity.ok("Friend request sent successfully");
    }

    @GetMapping("/friendsList/getRequests/{userId}")
    public ResponseEntity<Set<Nutzer>> getFriendRequests(@PathVariable Long userId) {
        Set<Nutzer> requests = friendRequestService.getFriendRequests1(userId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/declineRequest")
    public ResponseEntity<String> declineFriendRequest(@RequestParam("receiverId") Long receiverId, @RequestParam("userId") Long userId) {
        try {
            friendRequestService.declineFriendRequest(receiverId, userId);
            return ResponseEntity.ok("Friend request declined successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
