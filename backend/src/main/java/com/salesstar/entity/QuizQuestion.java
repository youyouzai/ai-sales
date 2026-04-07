package com.salesstar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    /** 选项 JSON 数组：["选项A","选项B","选项C","选项D"] */
    @Column(nullable = false, columnDefinition = "JSON")
    private String options;

    /** 正确答案索引（0-based） */
    @Column(nullable = false)
    private Integer correctIndex;

    /** 解析说明 */
    @Column(columnDefinition = "TEXT")
    private String explanation;

    private Integer xpReward;
}
