package com.salesstar.service;

import com.salesstar.dto.CustomerDTO;
import com.salesstar.entity.Customer;
import com.salesstar.entity.CustomerVisit;
import com.salesstar.entity.User;
import com.salesstar.repository.CustomerRepository;
import com.salesstar.repository.CustomerVisitRepository;
import com.salesstar.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerVisitRepository visitRepository;
    private final UserRepository userRepository;

    public List<CustomerDTO> getCustomers(Long userId, String segment, String keyword) {
        List<Customer> list;
        if (keyword != null && !keyword.isBlank()) {
            list = customerRepository.searchByUserIdAndKeyword(userId, keyword);
        } else if (segment != null && !segment.isBlank() && !"all".equals(segment)) {
            list = customerRepository.findByUserIdAndSegmentOrderByCreatedAtDesc(userId, segment);
        } else {
            list = customerRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return list.stream().map(CustomerDTO::from).toList();
    }

    public CustomerDTO getCustomer(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("客户不存在：" + id));
        return CustomerDTO.from(c);
    }

    @Transactional
    public CustomerDTO createCustomer(Long userId, CreateCustomerRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Customer c = new Customer();
        c.setUser(user);
        c.setName(req.getName());
        c.setPhone(req.getPhone());
        c.setAge(req.getAge());
        c.setJob(req.getJob());
        c.setBudget(req.getBudget());
        c.setSegment(req.getSegment() != null ? req.getSegment() : "warm");
        c.setTags(req.getTags());

        return CustomerDTO.from(customerRepository.save(c));
    }

    @Transactional
    public CustomerDTO addVisit(Long customerId, AddVisitRequest req) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("客户不存在：" + customerId));

        CustomerVisit visit = new CustomerVisit();
        visit.setCustomer(customer);
        visit.setType(req.getType());
        visit.setNote(req.getNote());
        visit.setVisitDate(LocalDate.now());
        visitRepository.save(visit);

        // 重新查询获取最新数据
        return CustomerDTO.from(customerRepository.findById(customerId).get());
    }

    @Data
    public static class CreateCustomerRequest {
        private String name;
        private String phone;
        private Integer age;
        private String job;
        private String budget;
        private String segment;
        private String tags;
    }

    @Data
    public static class AddVisitRequest {
        private String type;
        private String note;
    }
}
