package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "learning_paths")
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10)
    private String icon;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 200)
    private String subtitle;

    private Integer xpReward;

    private Boolean done;

    private Boolean active;

    private Integer sortOrder;

    @PrePersist
    protected void onCreate() {
        if (done == null) done = false;
        if (active == null) active = false;
    }
}
