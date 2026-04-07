package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "sales_tips")
public class SalesTip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 分类：open / objection / close / followup
     */
    @Column(length = 20)
    private String category;

    @Column(length = 10)
    private String icon;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer sortOrder;
}
