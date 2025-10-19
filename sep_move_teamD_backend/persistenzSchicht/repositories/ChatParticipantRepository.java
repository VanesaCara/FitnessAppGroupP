package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatParticipant;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatParticipantRepository extends JpaRepository <ChatParticipant, Long>{

    List<ChatParticipant> findByChatroom(ChatRoom chatRoom);

    List<ChatParticipant> findByParticipantId(Long userId);

    boolean existsByChatroomAndParticipantId(ChatRoom chatRoom, Long userId);

}
