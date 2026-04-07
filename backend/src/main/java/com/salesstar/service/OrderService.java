package com.salesstar.service;

import com.salesstar.dto.OrderDTO;
import com.salesstar.entity.Order;
import com.salesstar.entity.Product;
import com.salesstar.entity.User;
import com.salesstar.repository.CustomerRepository;
import com.salesstar.repository.OrderRepository;
import com.salesstar.repository.ProductRepository;
import com.salesstar.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public List<OrderDTO> getOrders(Long userId, String status) {
        List<Order> list = (status == null || status.isBlank() || "all".equals(status))
                ? orderRepository.findByUserIdWithProduct(userId)
                : orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        return list.stream().map(OrderDTO::from).toList();
    }

    public Map<String, Long> getOrderStats(Long userId) {
        return Map.of(
            "all",        orderRepository.countByUserIdAndStatus(userId, "pending")
                        + orderRepository.countByUserIdAndStatus(userId, "processing")
                        + orderRepository.countByUserIdAndStatus(userId, "completed")
                        + orderRepository.countByUserIdAndStatus(userId, "cancelled"),
            "pending",    orderRepository.countByUserIdAndStatus(userId, "pending"),
            "processing", orderRepository.countByUserIdAndStatus(userId, "processing"),
            "completed",  orderRepository.countByUserIdAndStatus(userId, "completed"),
            "cancelled",  orderRepository.countByUserIdAndStatus(userId, "cancelled")
        );
    }

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("商品不存在"));

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setCustomerName(req.getCustomerName());

        if (req.getCustomerId() != null) {
            customerRepository.findById(req.getCustomerId()).ifPresent(order::setCustomer);
        }

        order.setQuantity(req.getQuantity());
        order.setAmount(product.getPrice() * req.getQuantity());
        order.setCommission((int)((product.getPrice() - product.getCost()) * req.getQuantity() * 0.15));
        order.setNote(req.getNote());
        order.setOrderDate(LocalDate.now());

        // 生成订单号
        String orderNo = "ORD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + String.format("%04d", (int)(Math.random() * 9999));
        order.setOrderNo(orderNo);

        Order saved = orderRepository.save(order);
        return OrderDTO.from(saved);
    }

    @Transactional
    public OrderDTO updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));

        String oldStatus = order.getStatus();
        order.setStatus(status);

        // 完成订单时更新销售员数据
        if ("completed".equals(status) && !"completed".equals(oldStatus)) {
            User user = order.getUser();
            user.setDone(user.getDone() + order.getQuantity());
            user.setCommission(user.getCommission() + order.getCommission());
            userRepository.save(user);

            // 更新商品已售数量
            Product product = order.getProduct();
            product.setSold(product.getSold() + order.getQuantity());
            productRepository.save(product);
        }

        return OrderDTO.from(orderRepository.save(order));
    }

    @Data
    public static class CreateOrderRequest {
        private String customerName;
        private Long customerId;
        private Long productId;
        private Integer quantity = 1;
        private String note;
    }
}
