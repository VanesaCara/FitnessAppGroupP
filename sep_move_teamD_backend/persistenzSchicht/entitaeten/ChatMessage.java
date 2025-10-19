package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String chatRoomId;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private String senderName;


    //@Column(nullable = false)?
    private Date timestamp;

    @Enumerated(EnumType.STRING)
    //@Column(nullable = false)?
    private MessageStatus status;

}
