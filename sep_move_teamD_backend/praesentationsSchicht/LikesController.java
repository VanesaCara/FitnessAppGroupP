
package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.serviceSchicht.LikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikesController {

    @Autowired
    private LikesService likesService;


    @PostMapping("/liking/{activityId}/{userId}")
    public ResponseEntity<String> addLike(@PathVariable long activityId, @PathVariable long userId) {
        try {
            likesService.addLike(activityId, userId);
            return ResponseEntity.ok("Like added successfully.");
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unliking/{activityId}/{userId}")
    public ResponseEntity<String> removeLike(@PathVariable long activityId, @PathVariable long userId) {
        try {
            likesService.removeLike(activityId, userId);
            return ResponseEntity.ok("Like removed successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{activityId}/likeAmount")
    public ResponseEntity<Long> getLikesAmount(@PathVariable long activityId) {
        Long likesAmount = likesService.getLikesAmount(activityId);
        return ResponseEntity.ok(likesAmount);
    }
    @GetMapping("/{userId}/totalLikes")
    public ResponseEntity<Long> getLikesAmountByUser(@PathVariable long userId) {
         Long likesAmount = likesService.getLikesAmountByUser(userId);
         return ResponseEntity.ok(likesAmount);}

    @GetMapping("/likeStatus/{activityId}/{userId}")
    public ResponseEntity<Boolean> getLikedStatus(@PathVariable long activityId, @PathVariable long userId) {
        boolean liked = likesService.getLikedStatus(activityId, userId);
        return ResponseEntity.ok(liked);
    }


}

