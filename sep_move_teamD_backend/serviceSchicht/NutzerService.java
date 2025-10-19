package com.example.sep_moove_backend.serviceSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.persistenzSchicht.repositories.NutzerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class NutzerService {

    @Autowired
    private NutzerRepository nutzerRepository;
    @Autowired
    private EmailService emailService;
    private static final Random random = new Random();
    private static final String SUPER_CODE = "Gladbeck123"; //HIER

    public boolean istSuperCode (String code)
    {
        return SUPER_CODE.equals(code);
    }

    public Integer zfaCodeGenerieren()
    {
        int zfaCode = 1000 + random.nextInt(9000);
        return zfaCode;
    }
    public void zfaCodeSenden(Nutzer nutzer)
    {
        Integer zfaCode = zfaCodeGenerieren();
        nutzer.setZfaCode(zfaCode);
        nutzer.setZfaCodeGueltigkeit(Date.from(Instant.now().plus(5, ChronoUnit.MINUTES)));
        nutzerRepository.save(nutzer);
        emailService.sendeEmail(nutzer.getEmail(), "Dein 2FA Code für SEP MOVE!", "Dein Code lautet: "+zfaCode);
    }


    public Nutzer nutzerHinzufuegen(Nutzer nutzer)
    {
        return nutzerRepository.save(nutzer);
    }

    public boolean istEmailVerfuegbar(String email)
    {
        if(nutzerRepository.findByEmail(email).isPresent())
        {
            return false;
        }
        return true;
    }
    public boolean istNutzernameVerfuegbar(String nutzername)
    {
        if(nutzerRepository.findByNutzername(nutzername).isPresent())
        {
            return false;
        }
        return true;
    }

    public Nutzer anmelden(String nutzername, String passwort) {
            Optional<Nutzer> a = nutzerRepository.findByNutzername(nutzername);
            if (a.isPresent() && a.get().getPasswort().equals(passwort))
            {
                return a.get();
            }
            return null;


    }


    public void speichereProfilbild(MultipartFile bild, String nutzername) throws IOException
    {
        Nutzer nutzer = nutzerRepository.findByNutzername(nutzername).orElseThrow(() -> new RuntimeException("Nutzer nicht gefunden"));

        // Speichert das Bild im Dateisystem Ordner wird "profilbilder" heißen
        Path bildSpeicherPfad = Paths.get("profilbilder", nutzername + "_" + bild.getOriginalFilename());
        Files.createDirectories(bildSpeicherPfad.getParent());
        Files.write(bildSpeicherPfad, bild.getBytes());

        // Speichert den Dateipfad in der Datenbank
        nutzer.setProfilBildPfad(bildSpeicherPfad.toString());
        nutzerRepository.save(nutzer); // Speichere die Änderungen in der Datenbank
    }

    public Optional<Nutzer> getNutzerById(Long id) {//

        return nutzerRepository.findById(id);
    }

    public Optional <Nutzer> findByNutzername(String nutzername){return nutzerRepository.findByNutzername(nutzername);}


     public List<Nutzer> getAlleNutzer() {
          return nutzerRepository.findAll(); // Alle Nutzer zurückgeben
       }
    public boolean isAdmin (Long userId)
    {
        Nutzer nutzer = nutzerRepository.findById(userId).orElse(null);

        if(nutzer == null)
        {
            return false;
        }
        if (nutzer.getIstAdmin())
        {
            return true;
        }
        return false;
    }




}
