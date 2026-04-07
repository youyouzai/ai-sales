package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.YearMonth;

@Data
@Entity
@Table(name = "leaderboard", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "period"})
})
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 统计周期，如 "2024-01" */
    @Column(length = 10)
    private String period;

    /** 销售台数 */
    private Integer salesCount;

    /** 销售总额（分） */
    private Long salesAmount;

    /** 排名 */
    private Integer rank;

    /** 趋势：up / down / neutral */
    @Column(length = 10)
    private String trend;
}
