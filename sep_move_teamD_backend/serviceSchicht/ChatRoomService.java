package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatParticipant;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.ChatRoom;
//import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatParticipantRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatParticipantRepository;
import com.example.sep_moove_backend.persistenzSchicht.repositories.ChatRoomRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatParticipantRepository chatParticipantRepository;



    /*************************************************************************/
    public ChatRoom createRoom(List<Long> participantIds) {

            String chatRoomId = RandomStringUtils.randomAlphanumeric(8);
            ChatRoom chatRoom = ChatRoom.builder().chatRoomId(chatRoomId).build();
            ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
            List<ChatParticipant> participants = participantIds.stream()
                .map(participantId -> {
                    if (participantId == null) {
                        throw new IllegalArgumentException("Participant ID ist 'null'");
                    }
                    System.out.println("Participants erstellt: " + participantId);
                    return ChatParticipant.builder()
                            .participantId(participantId)
                            .chatroom(savedChatRoom)
                            .build();
                })
                .toList();

        chatParticipantRepository.saveAll(participants);
        savedChatRoom.setChatParticipants(participants);


            return savedChatRoom;
        }
        /****************************************************************************/


        public List<ChatRoom> getChatRoomsByUserId(Long userId) {
            return chatRoomRepository.findChatRoomsByUserId(userId);
        }
       }




