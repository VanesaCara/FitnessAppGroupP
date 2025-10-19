package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatMessage;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoom;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoomRequest;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.MessageStatus;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatMessageRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatRoomRepository;
import com.example.sep_moove_backend.serviceSchicht.ChatMessageService;
import com.example.sep_moove_backend.serviceSchicht.ChatRoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/chatrooms")

public class ChatRoomController {


    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatMessageService chatMessageService;



    /******************************Create Room********************************************/
    @PostMapping("/create")
    public ResponseEntity<ChatRoom> createRoom(@RequestBody ChatRoomRequest chatRoomRequest) {

        List<Long> participantIds = chatRoomRequest.getParticipantIds();


        if (participantIds == null || participantIds.size() < 2 || participantIds.stream().anyMatch(Objects::isNull)) {
            return ResponseEntity.badRequest().build();
        }


        ChatRoom chatRoom = chatRoomService.createRoom(participantIds);

        return ResponseEntity.ok(chatRoom);
    }

    /*****************************Delete MEssage*********************************************/


    @DeleteMapping("/messages/{userId}/{messageId}/delete")
    public ResponseEntity<?> delete(@PathVariable String messageId,
                                    @PathVariable String userId
    )
    {

        Long mId =  Long.valueOf(messageId);
        Long uId = Long.valueOf(userId);
        ChatMessage chatMessage = chatMessageService.findMessageById(mId);
        if (chatMessage != null & chatMessage.getSenderId() == uId) {
            try {
                boolean isDeleted = chatMessageService.deleteMessage(mId);

                if (isDeleted) {
                    return ResponseEntity.ok("Message deleted successfully.");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nachricht nicht gefunden");
                }




            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Löschen.");
            }} else {return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Nachricht kann nicht (mehr) bearbeitet werden.");
    }}



    /**************************************************************************/
    @PutMapping("{chatRoomId}/messages/{messageId}/edit")
    public ResponseEntity<?> editMessage(@PathVariable String chatRoomId,
                                         @PathVariable String messageId,
                                         @RequestBody Map<String, String> newText)
                                         {

        Long mId =  Long.valueOf(messageId);
        String edit = newText.get("textEdit");
        if (newText == null) {
            return ResponseEntity.badRequest().body("Der neue Text darf nicht leer sein!");
        }
try {
    ChatMessage chatMessage = chatMessageRepository.findById(mId).orElse(null);
    if (chatMessage == null) {
        return ResponseEntity.notFound().build();
    }
if(chatMessage.getSenderId() != Long.valueOf(newText.get("userId"))) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body("Nachricht kann nicht von dir bearbeitet werden.");
}
    chatMessage.setMessage(edit);
    chatMessageService.save(chatMessage);
    int rowsUpdated = chatMessageService.editMessage(mId, edit.trim());

    if (rowsUpdated > 0) {
        return ResponseEntity.ok("Nachricht wurde aktualisiert");
    } else {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Nachricht kann nicht (mehr) bearbeitet werden.");
    }
} catch (Exception e) {


    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating message.");
}
       /* ChatMessage updatedMessage = chatMessageRepository.findById(messageId).orElseThrow();
        template.convertAndSend("/topic/chatroom/" + chatRoomId, updatedMessage);
        Es muss nicht an die Queue gesendet werden. Bei Bearbeitung wird angenommen, dass der Empfänger keine WS connection
        hat und die ankommenden Nachrichten über die DB holen muss. D.h. wenn der Empfänger die Nachrichten von der Datenbank holt,
        sieht er schon die veränderte Nachricht*/



             }

    /**************************************************************************/

    @GetMapping("/findrooms/{userId}")
    public List<ChatRoom> getChatRoomsByUserId(@PathVariable Long userId) {

        return chatRoomService.getChatRoomsByUserId(userId);
    }

/**************************************************************************/

@GetMapping("/getChat/{chatRoomId}/{senderId}")
    public ResponseEntity<List<ChatMessage>> getChatByChatId(@PathVariable String chatRoomId, @PathVariable Long senderId) {

    List<ChatMessage> messages = chatMessageService.findChatMessages(chatRoomId, senderId);
    if (messages.isEmpty()) {

        return ResponseEntity.ok(Collections.emptyList());
    }
    return ResponseEntity.ok(messages);
}}


