package com.example.sep_moove_backend.serviceSchicht;


import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
@AllArgsConstructor
public class FriendRequestEmailService {
    @Autowired

    private final JavaMailSender mailSender;

    public void sendFriendshipRequestEmail(Nutzer receiverUser, Nutzer sender) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("teamdsepmove@gmail.com");
        message.setTo(receiverUser.getEmail());
        message.setSubject("Freundschaftsanfrage erhalten");
        message.setText("Hallo " + receiverUser.getVorname() + ",\n\nDu hast eine Freundschaftsanfrage von " + sender.getNutzername() + " erhalten.\n\n");


        System.out.println("Freundschaftsanfrage-Email erstellt für: " + receiverUser.getEmail());
        mailSender.send(message);

}

}