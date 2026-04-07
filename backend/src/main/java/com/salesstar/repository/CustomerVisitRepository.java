package com.salesstar.repository;

import com.salesstar.entity.CustomerVisit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerVisitRepository extends JpaRepository<CustomerVisit, Long> {

    List<CustomerVisit> findByCustomerIdOrderByVisitDateDesc(Long customerId);
}
