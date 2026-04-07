package com.salesstar.repository;

import com.salesstar.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {

    List<LearningPath> findAllByOrderBySortOrderAsc();
}
