package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String brand;

    @Column(length = 10)
    private String emoji;

    /** 零售价（分） */
    @Column(nullable = false)
    private Integer price;

    /** 进价（分） */
    @Column(nullable = false)
    private Integer cost;

    /** 库存数量 */
    private Integer stock;

    /** 已售数量 */
    private Integer sold;

    /** 标签，逗号分隔 */
    @Column(length = 200)
    private String tags;

    /** 商品描述 */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** 规格 JSON：{"屏幕":"6.7英寸",...} */
    @Column(columnDefinition = "JSON")
    private String specs;

    /** 销售话术要点 JSON：["要点1","要点2",...] */
    @Column(columnDefinition = "JSON")
    private String sellingPoints;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (sold == null) sold = 0;
        if (stock == null) stock = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
