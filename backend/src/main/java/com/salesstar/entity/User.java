package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 10)
    private String avatar;

    @Column(length = 100)
    private String role;

    /** 底薪 */
    private Integer baseSalary;

    /** 当月提成 */
    private Integer commission;

    /** 当月奖金 */
    private Integer bonus;

    /** 当月销售目标（台数） */
    private Integer target;

    /** 当月已完成台数 */
    private Integer done;

    /** 经验值 XP */
    private Integer xp;

    /** 连续打卡天数 */
    private Integer streak;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
