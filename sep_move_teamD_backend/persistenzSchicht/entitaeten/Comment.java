package com.example.sep_moove_backend.persistenzSchicht.entitaeten;

import jakarta.persistence.*;


@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String text; // The content of the comment


    @Column(nullable = false)
    private boolean isRemoved = false;

    @ManyToOne // Many comments can belong to one activity
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity; // The activity this comment is associated with

    @ManyToOne // Many comments can belong to one user
    @JoinColumn(name = "author_id", nullable = false)
    private Nutzer author; // The user who wrote the comment

    @Column(nullable = false)
    private String removalReason = "";

    // Getters and setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }


    public boolean isRemoved() {
        return isRemoved;
    }

    public void setRemoved(boolean removed) {
        isRemoved = removed;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Nutzer getAuthor() {
        return author;
    }

    public void setAuthor(Nutzer author) {
        this.author = author;
    }

    public String getRemovalReason() {
        return removalReason;
    }

    public void setRemovalReason(String removalReason) {
        this.removalReason = removalReason;
    }
}
