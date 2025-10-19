package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatMessage;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.MessageStatus;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.StatusUpdate;//diese beiden Klassen werden nicht autowired, weil nicht nur ihre methoden benötigt, sondern auch Instanzen erstellt werden müssen
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.example.sep_moove_backend.serviceSchicht.ChatMessageService;
import com.example.sep_moove_backend.serviceSchicht.ChatRoomService;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatNotification;

import java.util.Map;


@Controller

public class ChatController {
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private ChatMessageService chatMessageService;
  //  @Autowired
  //  private ChatRoomService chatRoomService;

    @Autowired
    private ObjectMapper objectMapper;

    @MessageMapping ("/chat")
    public void processMessage (@Payload Map<String, Object> message)


    {
        String type = message.get("type").toString();
        switch (type){

        case "Chat":

        try {
            ChatMessage chatMessage = objectMapper.convertValue(message, ChatMessage.class);


        ChatMessage saved = chatMessageService.save(chatMessage);

        template.convertAndSend (
                "/chatroom/" + saved.getChatRoomId() +"/messages",

                new ChatNotification(
                        saved.getId(),

                        saved.getSenderId(),

                        saved.getSenderName(),
                        saved.getMessage(),
                        saved.getTimestamp()
                )


                );



            System.out.println("Nachricht wurde an folgende queue gesendet: /chatroom/" + chatMessage.getChatRoomId());

        } catch (Exception e) {

            e.printStackTrace();
        } break;
            case "Status":
                try {
                    StatusUpdate statusUpdate = objectMapper.convertValue(message, StatusUpdate.class);
                    MessageStatus messageStatus = MessageStatus.valueOf(statusUpdate.getStatus());
                    System.out.println("Status: " + statusUpdate.getStatus());
                    long messageId = statusUpdate.getMessageId();
                    long userId = statusUpdate.getUserId();
                    String authorId = statusUpdate.getMessAuthorId();
                    System.out.println("Message ID: " + messageId);
                    System.out.println("Message author: " + authorId);
                    chatMessageService.updateStatus(messageId, userId, messageStatus);


                    template.convertAndSend(
                            "/chatroom/" + authorId + "/status",
                            statusUpdate
                    );
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;


        }


    }


}
