package com.salesstar.repository;

import com.salesstar.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByBrandIgnoreCase(String brand);

    List<Product> findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(String name, String brand);

    @Query("SELECT p FROM Product p ORDER BY (p.price - p.cost) DESC")
    List<Product> findAllOrderByProfitDesc();

    @Query("SELECT p FROM Product p ORDER BY (p.price - p.cost) ASC")
    List<Product> findAllOrderByProfitAsc();
}
