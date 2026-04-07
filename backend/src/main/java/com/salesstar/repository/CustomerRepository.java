package com.salesstar.repository;

import com.salesstar.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Customer> findByUserIdAndSegmentOrderByCreatedAtDesc(Long userId, String segment);

    @Query("SELECT c FROM Customer c WHERE c.user.id = :userId AND " +
           "(c.name LIKE %:keyword% OR c.phone LIKE %:keyword%)")
    List<Customer> searchByUserIdAndKeyword(@Param("userId") Long userId,
                                            @Param("keyword") String keyword);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
