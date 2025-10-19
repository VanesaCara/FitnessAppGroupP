package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ChatRoomRequest {
        //private String name;
        private List<Long> participantIds;
}
