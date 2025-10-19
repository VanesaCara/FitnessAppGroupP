package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Nutzer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nutzername;

    @Column (nullable = false)
    String passwort;

    @Column(nullable = false)
    private String email;


    private String vorname;
    private String nachname;
    private Date geburtsdatum;
    private String geschlecht;
    private Double gewicht;
    private Double groesse;
    private Boolean istAdmin;
    private String profilBildPfad;
    private Boolean hatZfa;  // Gibt an, ob ZFA aktiviert ist
    private Integer zfaCode;  // Speichert den ZFA-Code
    private Date zfaCodeGueltigkeit;  // Ablaufdatum des ZFA-Codes

    private boolean isFriendListPrivate = false;

    @OneToMany(mappedBy = "nutzer")
    @JsonBackReference
    @JsonIgnore
    private List<Activity> activities;



    @Setter
    @Getter
    @ManyToMany
    @JoinTable(name = "user_friends", joinColumns = @JoinColumn(name = "friend_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private Set<Nutzer> friendList = new HashSet<>();

    @ManyToMany(mappedBy = "friendList")
    @JsonBackReference
    private Set<Nutzer> friends = new HashSet<>();

    @Setter
    @Getter
    @ManyToMany
    @JoinTable(name = "friend_requests", joinColumns = @JoinColumn(name = "sender_id"), inverseJoinColumns = @JoinColumn(name = "receiver_id"))

    @JsonIgnore
    private Set<Nutzer> sentFriendRequests = new HashSet<>();

    @Setter
    @Getter
    @ManyToMany(mappedBy = "sentFriendRequests")
    @JsonBackReference
    @JsonIgnore
    private Set<Nutzer> receivedFriendRequests = new HashSet<>();

    public boolean isFriendListPrivate() {
        return isFriendListPrivate;
    }

    public void setFriendListPrivate(boolean friendListPrivate) {
        isFriendListPrivate = friendListPrivate;
    }



    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public Boolean getHatZfa() {return hatZfa;}

    public void setHatZfa(Boolean hatZfa) {this.hatZfa = hatZfa;}

    public Date getZfaCodeGueltigkeit() {return zfaCodeGueltigkeit;}

    public void setZfaCodeGueltigkeit(Date zfaCodeGueltigkeit) {this.zfaCodeGueltigkeit = zfaCodeGueltigkeit;
    }

    public Integer getZfaCode() {return zfaCode;
    }

    public void setZfaCode(Integer zfaCode) {this.zfaCode = zfaCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNutzername() {
        return nutzername;
    }

    public void setNutzername(String nutzername) {
        this.nutzername = nutzername;
    }

    public String getPasswort() {
        return passwort;
    }

    public void setPasswort(String passwort) {
        this.passwort = passwort;
    }

    public String getVorname() {
        return vorname;
    }

    public void setVorname(String vorname) {
        this.vorname = vorname;
    }

    public String getNachname() {
        return nachname;
    }

    public void setNachname(String nachname) {
        this.nachname = nachname;
    }

    public Date getGeburtsdatum() {
        return geburtsdatum;
    }

    public void setGeburtsdatum(Date geburtsdatum) {
        this.geburtsdatum = geburtsdatum;
    }

    public String getGeschlecht() {
        return geschlecht;
    }

    public void setGeschlecht(String geschlecht) {
        this.geschlecht = geschlecht;
    }

    public Double getGewicht() {
        return gewicht;
    }

    public void setGewicht(Double gewicht) {
        this.gewicht = gewicht;
    }

    public Double getGroesse() {
        return groesse;
    }

    public void setGroesse(Double groesse) {
        this.groesse = groesse;
    }

    public Boolean getIstAdmin() {
        return istAdmin;
    }

    public void setIstAdmin(Boolean istAdmin) {
        this.istAdmin = istAdmin;
    }

    public String getProfilBildPfad() {
        return profilBildPfad;
    }

    public void setProfilBildPfad(String profilBildPfad) {
        this.profilBildPfad = profilBildPfad;
    }
}
