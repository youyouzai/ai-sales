package com.salesstar.repository;

import com.salesstar.entity.SalesTip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesTipRepository extends JpaRepository<SalesTip, Long> {

    List<SalesTip> findAllByOrderBySortOrderAsc();

    List<SalesTip> findByCategoryOrderBySortOrderAsc(String category);
}
