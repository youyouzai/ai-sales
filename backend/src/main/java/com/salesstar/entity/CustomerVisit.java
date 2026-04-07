package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "customer_visits")
public class CustomerVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    /**
     * 拜访方式：visit / call / wechat
     */
    @Column(length = 20)
    private String type;

    private LocalDate visitDate;

    @Column(columnDefinition = "TEXT")
    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (visitDate == null) visitDate = LocalDate.now();
    }
}
