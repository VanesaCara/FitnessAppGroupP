package com.example.sep_moove_backend.serviceSchicht;



import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoom;
//import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ResourceNotFoundException;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatMessage;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.MessageStatus;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatMessageRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository repository;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    /**************************************************************************/


    public ChatMessage save(ChatMessage chatMessage) {
        chatMessage.setStatus(MessageStatus.RECEIVED);

        return repository.save(chatMessage);
    }
    /**************************************************************************/

    public List<ChatMessage> findChatMessages(String chatRoomId, Long senderId) {


        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByChatRoomId(chatRoomId);


if (chatRoomOptional.isPresent()) {


    ChatRoom chatRoom = chatRoomOptional.get();


    var messages = repository.findByChatRoomId(chatRoom.getChatRoomId());


    System.out.println("Fetched messages: " + messages.size());


    return messages;
}
        System.out.println("ChatRoom not found for chatRoomId: " + chatRoomId);
        return new ArrayList<>();
    }


/**************************************************************************/

    public void updateStatus(Long messageId, Long userID, MessageStatus status) {
        ChatMessage chatMessage = repository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Nachricht nicht gefunden"));

        System.out.println("Message ID: " + messageId);
        chatMessage.setStatus(status);
        repository.save(chatMessage);
    }
    /**************************************************************************/
    public int editMessage(Long messageId, String newText) {

        return repository.editMessage(messageId, newText);
    }
    /**************************************************************************/
    public boolean deleteMessage(Long messageId) {

        Optional<ChatMessage> chatMessageOptional = repository.findById(messageId);
        if (chatMessageOptional.isPresent()) {

            repository.deleteById(messageId);
            return true;
        }
        return false;
    }



    /**************************************************************************/
public ChatMessage findMessageById(Long messageId) {
    return repository.findById(messageId).orElse(null);
}
}
