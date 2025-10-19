package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long participantId;

    @ManyToOne
    @JoinColumn(name = "chat_Room_Id")
    @JsonIgnore
    private ChatRoom chatroom;


}
