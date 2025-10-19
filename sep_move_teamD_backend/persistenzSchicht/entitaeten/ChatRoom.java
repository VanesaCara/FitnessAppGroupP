package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique= true, name = "chat_room_id")
    private String chatRoomId;




    @OneToMany (mappedBy = "chatroom", fetch = FetchType.LAZY)
    private List<ChatParticipant> chatParticipants = new ArrayList<>();;


}
