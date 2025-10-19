package com.example.sep_moove_backend.praesentationsSchicht;


import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Comment;
import com.example.sep_moove_backend.serviceSchicht.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:3000")
    public class CommentController {

        @Autowired
        private CommentService commentService;




    @GetMapping("/{activityId}")
    public ResponseEntity<List<Comment>> getCommentsByActivity(@PathVariable long activityId) {
        List<Comment> comments = commentService.getCommentsByActivity(activityId);
        return ResponseEntity.ok(comments);
    }


    @PostMapping("/add")
        public ResponseEntity<String> addComment(
                @RequestParam long activityId,
                @RequestParam long authorId,
                @RequestBody String text) {
            commentService.addComment(activityId, authorId, text);
            return ResponseEntity.ok("Comment added successfully.");
        }

        @DeleteMapping("/{commentId}/remove")
        public ResponseEntity<String> removeComment(
                @PathVariable long commentId,
                @RequestParam long userId)
               {
            commentService.removeComment(commentId, userId);
            return ResponseEntity.ok("Comment removed successfully.");
        }
    }




