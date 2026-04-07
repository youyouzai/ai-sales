package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.dto.OrderDTO;
import com.salesstar.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** GET /api/orders?userId=1&status=pending */
    @GetMapping
    public ApiResponse<List<OrderDTO>> getOrders(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(required = false) String status) {
        return ApiResponse.ok(orderService.getOrders(userId, status));
    }

    /** GET /api/orders/stats?userId=1 */
    @GetMapping("/stats")
    public ApiResponse<Map<String, Long>> getStats(
            @RequestParam(defaultValue = "1") Long userId) {
        return ApiResponse.ok(orderService.getOrderStats(userId));
    }

    /** POST /api/orders */
    @PostMapping
    public ApiResponse<OrderDTO> createOrder(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody OrderService.CreateOrderRequest req) {
        return ApiResponse.ok(orderService.createOrder(userId, req));
    }

    /** PUT /api/orders/{id}/status */
    @PutMapping("/{id}/status")
    public ApiResponse<OrderDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) return ApiResponse.error("status 不能为空");
        return ApiResponse.ok(orderService.updateStatus(id, status));
    }
}
