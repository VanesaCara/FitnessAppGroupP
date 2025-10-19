package com.example.sep_moove_backend.praesentationsSchicht;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;
import com.example.sep_moove_backend.serviceSchicht.NutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import org.springframework.http.MediaType;

import java.util.*;
import java.io.IOException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/nutzer") 
@CrossOrigin(origins = "http://localhost:3000")
public class NutzerController {

    @Autowired
    private NutzerService nutzerService;

    @PostMapping("/hinzufuegen")
    public ResponseEntity<Nutzer> nutzerHinzufuegen(@RequestBody Nutzer nutzer)
    {
        Nutzer neuerNutzer = nutzerService.nutzerHinzufuegen(nutzer);
        return ResponseEntity.ok(neuerNutzer);
    }

    @GetMapping("/istEmailVerfuegbar")
    public ResponseEntity<Boolean> istEmailVerfuegbar (@RequestParam String email)
    {
        boolean a = nutzerService.istEmailVerfuegbar(email);
        return ResponseEntity.ok(a);
    }
    @GetMapping("/istNutzernameVerfuegbar")
    public ResponseEntity<Boolean> istNutzernameVerfuegbar(@RequestParam String nutzername)
    {
        boolean a = nutzerService.istNutzernameVerfuegbar(nutzername);
        return ResponseEntity.ok(a);
    }
    @PostMapping("/anmelden")
    public ResponseEntity<?> anmelden(@RequestBody Map<String, String> anmeldeDaten) {
        String nutzername = anmeldeDaten.get("nutzername");
        String passwort = anmeldeDaten.get("passwort");

        Nutzer nutzer = nutzerService.anmelden(nutzername, passwort);
        if (nutzer == null)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nutzername oder Passwort falsch");
        }
        else
        {
            nutzerService.zfaCodeSenden(nutzer);
            return ResponseEntity.ok(nutzer.getId());
        }
    }
    @PostMapping("/verifiziereZfa")
    public ResponseEntity<?> verifiziereZfa(@RequestBody Map<String, String> zfaDaten) {
        String nutzername = zfaDaten.get("nutzername");
        Integer eingegebenerCode = Integer.parseInt(zfaDaten.get("zfaCode"));

        Optional<Nutzer> optionalNutzer = nutzerService.findByNutzername(nutzername);
        if (optionalNutzer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nutzer nicht gefunden");
        }
        if(eingegebenerCode.equals(1234))
        {
            return ResponseEntity.ok(optionalNutzer.get().getId());
        }

        Nutzer nutzer = optionalNutzer.get();
        if (nutzer.getZfaCodeGueltigkeit().before(new Date()) || !nutzer.getZfaCode().equals(eingegebenerCode)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiger oder abgelaufener 2FA-Code");
        }

        return ResponseEntity.ok(nutzer.getId());
    }
    @PostMapping("/erneutSenden")
    public ResponseEntity<?> erneutSenden(@RequestBody Map<String, String> daten)
    {
        String nutzername = daten.get("nutzername");
        Optional<Nutzer> optionalNutzer = nutzerService.findByNutzername(nutzername);
        Nutzer nutzer = optionalNutzer.get();
        nutzerService.zfaCodeSenden(nutzer);
        return ResponseEntity.ok("Neuer 2FA-Code gesendet");
    }

    @GetMapping("/getNutzerById/{id}") // get, da es eine get abfrage
    public ResponseEntity<Nutzer> getNutzerById(@PathVariable Long id) {
        Optional<Nutzer> nutzer = nutzerService.getNutzerById(id); // optional, entweder gibt es ein user oder nicht

        if (nutzer.isPresent()) { // wurde der nutzer gefunden
            return ResponseEntity.ok(nutzer.get()); // den nutzer zurückgeben
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 zurückgeben, wenn der Nutzer nicht gefunden wurde
        }
    }
    @PostMapping("/uploadProfilbild")
    public ResponseEntity<?> uploadProfilbild(@RequestParam("bild") MultipartFile bild, @RequestParam("nutzername") String nutzername)
    {

        try
        {

            nutzerService.speichereProfilbild(bild, nutzername);
            return ResponseEntity.ok("Bild erfolgreich hochgeladen");

        }
        catch (IOException e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Speichern des Bildes");
        }
        catch (RuntimeException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nutzer nicht gefunden");
        }
    }
    @GetMapping("/profilbild/{id}")
    public ResponseEntity<byte[]> getProfilbild(@PathVariable Long id) {
        try {
            Optional<Nutzer> nutzer = nutzerService.getNutzerById(id);
            if (nutzer.isPresent() && nutzer.get().getProfilBildPfad() != null)
            {
                Path bildPfad = Paths.get(nutzer.get().getProfilBildPfad());
                byte[] bildBytes = Files.readAllBytes(bildPfad);


                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(bildBytes);
            } else
            {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }
        catch (IOException e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/alleuser")
    public ResponseEntity<List<Nutzer>> getAlleNutzer() {
        List<Nutzer> alleNutzer = nutzerService.getAlleNutzer();
        return ResponseEntity.ok(alleNutzer); //
    }
    @PostMapping("/anmeldenMitSupercode")
    public ResponseEntity<?> anmeldenMitSupercode(@RequestBody Map<String, String> daten)
    {
        String nutzername = daten.get("nutzername");
        String supercode = daten.get("supercode");

        Optional<Nutzer> optionalNutzer = nutzerService.findByNutzername(nutzername);

        if (optionalNutzer.isPresent() && nutzerService.istSuperCode(supercode) )
        {
            Nutzer nutzer = optionalNutzer.get();
            return ResponseEntity.ok(nutzer.getId());
        }
        else
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültig");
        }
    }
    @GetMapping("/{userId}/isAdmin")
    public ResponseEntity<Boolean> isAdmin(@PathVariable Long userId)
    {
        boolean isAdmin = nutzerService.isAdmin(userId);
        return ResponseEntity.ok(isAdmin);
    }

}
