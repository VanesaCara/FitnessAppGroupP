package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    //muss ersetzt werden mit "findByParticipantsIds" und als Parameter eine Liste der ParticipantId
    Optional<ChatRoom> findByChatParticipants_ParticipantIdIn(List<Long> participantIds);

     Optional<ChatRoom> findByChatRoomId(String chatRoomId);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatParticipants cp WHERE cp.participantId = :userId")
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

}
