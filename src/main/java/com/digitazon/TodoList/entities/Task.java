package com.digitazon.TodoList.entities;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private boolean done;
    private LocalDateTime created;

    @ManyToOne(fetch = FetchType.EAGER) //fetch x prendere
    @JoinColumn(name = "category_id")
    private Category category;


    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Category getCategory() {
        return category;
    }

    public boolean isDone() {
        return done;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}
