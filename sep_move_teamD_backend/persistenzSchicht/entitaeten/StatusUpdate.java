package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StatusUpdate {

 private long messageId;
 private String messAuthorId;
 private long userId;


 private String type;

 private String status;




}
