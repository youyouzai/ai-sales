package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 20)
    private String phone;

    private Integer age;

    @Column(length = 100)
    private String job;

    /** 预算范围，如 "4000-6000" */
    @Column(length = 20)
    private String budget;

    /**
     * 客户分级：hot / warm / cold / vip
     */
    @Column(length = 10)
    private String segment;

    /** 标签，逗号分隔 */
    @Column(length = 500)
    private String tags;

    /** 历史成交金额（分） */
    private Integer budgetActual;

    /** 历史购买记录，逗号分隔商品名 */
    @Column(length = 500)
    private String purchased;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("visitDate DESC")
    private List<CustomerVisit> visits;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (budgetActual == null) budgetActual = 0;
        if (segment == null) segment = "warm";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
