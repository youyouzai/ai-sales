package com.salesstar.repository;

import com.salesstar.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, String status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT SUM(o.commission) FROM Order o WHERE o.user.id = :userId AND o.status = 'completed'")
    Long sumCommissionByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(o.quantity) FROM Order o WHERE o.user.id = :userId AND o.status = 'completed'")
    Integer sumQuantityCompletedByUserId(@Param("userId") Long userId);

    @Query("SELECT o FROM Order o JOIN FETCH o.product WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdWithProduct(@Param("userId") Long userId);
}
