package com.example.sep_moove_backend.praesentationsSchicht;


import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.serviceSchicht.FriendsListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.Objects;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/freunde") //Damit API_BASE_URL an localhost8080/freunde endpunkt verbindet
public class FriendsListController {

    @Autowired
    FriendsListService friendsListService ;

    // NEUER CODE
    @PostMapping("/friendsList/{receiverId}/accepted/{senderId}")
    public ResponseEntity<Map<String, String>> acceptFriendRequest(
            @PathVariable("receiverId") Long receiverId,
            @PathVariable("senderId") Long senderId) {
        try {
            friendsListService.friendRequestAccepted(senderId, receiverId);
            System.out.println("Freundschaftsanfrage erfolgreich akzeptiert");
            return ResponseEntity.ok(Collections.singletonMap("message", "Freundschaftsanfrage akzeptiert"));
        } catch (Exception e) {
            System.err.println("Fehler beim Akzeptieren der Freundschaftsanfrage: " + e.getMessage());
            e.printStackTrace(); // Stacktrace ausgeben
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Fehler beim Verarbeiten der Anfrage", e);
        }
    }



    @GetMapping("/friendsList/getId/{userId}")
    public ResponseEntity<Nutzer> getUserById(@PathVariable Long userId) {
        Nutzer user = friendsListService.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/friendsList/getEm/{email}")
    public ResponseEntity<Nutzer> getUserByEmail(@PathVariable String email) {
        Nutzer user = friendsListService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/friendsList/{userID}/remove/{friendId}")
    public void removeFriend(@PathVariable Long userID, @PathVariable Long friendId) {
        friendsListService.removeFriend(userID, friendId);
    }

    @GetMapping("/admin/friendsList/getList/{userId}")
    public ResponseEntity<List<Nutzer>> getFriendsListByAdmin(@PathVariable Long userId) {
        List<Nutzer> friends = friendsListService.findFriends(userId);
        return ResponseEntity.ok(friends);
    }

    @PutMapping("/friendsList/{userId}/privacy")
    public ResponseEntity<?> updateFriendListPrivacy(@PathVariable Long userId, @RequestBody Map<String, Boolean> request) {
        Boolean isPrivate = request.get("isPrivate");
        if (isPrivate == null) {
            return ResponseEntity.badRequest().body("Request body should contain 'isPrivate' field.");
        }

        friendsListService.updateFriendListPrivacy(userId, isPrivate);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/friendsList/getAllFriends/{userId}")
    public ResponseEntity<List<Nutzer>> getFriendsList(@PathVariable Long userId) {
        List<Nutzer> friends = friendsListService.findFriends(userId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/friendsList/getList/{userId}")
    public ResponseEntity<?> getFriendsList1(
            @PathVariable Long userId,
            @RequestParam Long senderId) { // senderId = eingeloggter Nutzer

        Nutzer user = friendsListService.getUserById(userId);  // Zielnutzer
        Nutzer sender = friendsListService.getUserById(senderId); //Ich der ggf. Admin ist



        // NEUER CODE
        if (user == null || sender == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // Prüfung: Admin, Besitzer und Freunde dürfen immer zugreifen
        if (user.isFriendListPrivate()
                && user.getId() != sender.getId() // Prüft, ob der sender nicht der Besitzer der Freundesliste ist. (ist nicht unnötig weil es hier um die Anzeige beim BenutzerProfil geht)

                && !sender.getIstAdmin()) { //HIER WURDE CODE ENTFERNT WEGEN PRIVATSPHÄRE UND ANGEZEIGTER FREUNDESLISTE - Ahmet

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Friend list is private");
        }

        List<Nutzer> friends = friendsListService.findFriends(userId);
        return ResponseEntity.ok(friends);
    }
}