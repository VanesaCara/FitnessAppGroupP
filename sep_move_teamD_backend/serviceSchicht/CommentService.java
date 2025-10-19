package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Comment;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ActivityRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.CommentRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {


        @Autowired
        private CommentRepository commentRepository;

        @Autowired
        private ActivityRepository activityRepository;

        @Autowired
        private NutzerRepository nutzerRepository;




    public List<Comment> getCommentsByActivity(long activityId) {
        return commentRepository.findByActivityId(activityId);
    }

    public void addComment(long activityId, long authorId, String text) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        Nutzer author = nutzerRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the activity is private
        if (activity.getVisibility()==false) {
            // Allow comments only from the author or admin
            if (!(activity.getNutzer().getId() == author.getId()) && !author.getIstAdmin()) {
                throw new RuntimeException("You cannot comment on private activities.");
            }
        }

        // Create and save the comment
        Comment comment = new Comment();
        comment.setActivity(activity);
        comment.setAuthor(author);
        comment.setText(text);

        commentRepository.save(comment);
    }


    public void removeComment(long commentId, long userId) {
        // Retrieve the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Retrieve the user by userId
        Nutzer user = nutzerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // Check if the user is the author or an admin
        boolean isAdmin = user.getIstAdmin();
        boolean isAuthor = comment.getAuthor().getId() == userId;

        if (isAuthor || isAdmin) {

            comment.setRemoved(true);
            comment.setRemovalReason(isAdmin ? "[Vom Admin entfernt.]" : "[Vom Autor entfernt.]");
            comment.setText(comment.getRemovalReason());
            commentRepository.save(comment);
        } else {
            throw new RuntimeException("You are not authorized to remove this comment.");
        }
    }

}



