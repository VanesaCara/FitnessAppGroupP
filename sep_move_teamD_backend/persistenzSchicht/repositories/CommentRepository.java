package com.example.sep_moove_backend.persistenzSchicht.repositories;


import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByActivityId(long activityId);


}
