package com.salesstar.dto;

import com.salesstar.entity.Order;
import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private String orderNo;
    private String customerName;
    private Long customerId;
    private String productName;
    private Long productId;
    private Integer quantity;
    private Integer amount;
    private Integer commission;
    private String status;
    private String orderDate;
    private String note;

    public static OrderDTO from(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.id = o.getId();
        dto.orderNo = o.getOrderNo();
        dto.customerName = o.getCustomerName() != null ? o.getCustomerName()
                : (o.getCustomer() != null ? o.getCustomer().getName() : "");
        dto.customerId = o.getCustomer() != null ? o.getCustomer().getId() : null;
        dto.productName = o.getProduct() != null ? o.getProduct().getName() : "";
        dto.productId = o.getProduct() != null ? o.getProduct().getId() : null;
        dto.quantity = o.getQuantity();
        dto.amount = o.getAmount();
        dto.commission = o.getCommission();
        dto.status = o.getStatus();
        dto.orderDate = o.getOrderDate() != null ? o.getOrderDate().toString() : "";
        dto.note = o.getNote();
        return dto;
    }
}
