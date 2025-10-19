package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import lombok.Getter;
import lombok.Setter;

@Setter
@Entity
@Getter
public class Likes {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Nutzer nutzer;


}
