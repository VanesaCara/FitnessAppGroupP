package com.example.sep_moove_backend.models;



import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageModel {
    private String chatRoomId;
    private String messageText;
    private Long senderId;
    private String senderName;
    private String ChatroomId;
    private Date timestamp;
    private String status; // You can use a String or the MessageStatus enum
}
