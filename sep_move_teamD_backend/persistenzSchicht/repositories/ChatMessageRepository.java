package com.example.sep_moove_backend.persistenzSchicht.repositories;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatMessage;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.MessageStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatRoomId(String chatRoomId);

//Optional<ChatMessage> findChatMessageById(Long messageId);

    @Transactional
@Modifying
@Query("UPDATE ChatMessage m SET m.status = :status WHERE m.id = :messageId AND m.chatRoomId = :chatRoomId AND m.senderId != :userId")
int updateMessageStatus(@Param("status") MessageStatus status, @Param("messageId") Long messageId, @Param("userId") Long userId);
/**************************************************/

@Transactional
    @Modifying
    @Query("UPDATE ChatMessage m SET m.message = :textEdit WHERE m.id = :messageId AND m.status = 'RECEIVED'")
    int editMessage(@Param("messageId") Long messageId, @Param("textEdit") String textEdit);




}

