package com.salesstar.repository;

import com.salesstar.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

    @Query(value = "SELECT * FROM quiz_questions ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<QuizQuestion> findRandom();
}
