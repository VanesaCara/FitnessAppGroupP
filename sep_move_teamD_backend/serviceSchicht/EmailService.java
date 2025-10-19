package com.example.sep_moove_backend.serviceSchicht;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendeEmail(String an, String betreff, String nachricht)
    {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(an);
        simpleMailMessage.setSubject(betreff);
        simpleMailMessage.setText(nachricht);
        simpleMailMessage.setFrom("teamdsepmove@gmail.com");

        mailSender.send(simpleMailMessage);
    }
}

