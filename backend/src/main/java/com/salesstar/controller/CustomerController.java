package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.dto.CustomerDTO;
import com.salesstar.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /** GET /api/customers?userId=1&segment=hot&keyword=张 */
    @GetMapping
    public ApiResponse<List<CustomerDTO>> getCustomers(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(required = false) String segment,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(customerService.getCustomers(userId, segment, keyword));
    }

    /** GET /api/customers/{id} */
    @GetMapping("/{id}")
    public ApiResponse<CustomerDTO> getCustomer(@PathVariable Long id) {
        return ApiResponse.ok(customerService.getCustomer(id));
    }

    /** POST /api/customers */
    @PostMapping
    public ApiResponse<CustomerDTO> createCustomer(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody CustomerService.CreateCustomerRequest req) {
        return ApiResponse.ok(customerService.createCustomer(userId, req));
    }

    /** POST /api/customers/{id}/visits */
    @PostMapping("/{id}/visits")
    public ApiResponse<CustomerDTO> addVisit(
            @PathVariable Long id,
            @RequestBody CustomerService.AddVisitRequest req) {
        return ApiResponse.ok(customerService.addVisit(id, req));
    }
}
