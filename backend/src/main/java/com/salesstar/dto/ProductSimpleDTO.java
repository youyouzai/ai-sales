package com.salesstar.dto;

import com.salesstar.entity.Product;
import lombok.Data;
import java.util.Arrays;
import java.util.List;

@Data
public class ProductSimpleDTO {
    private Long id;
    private String name;
    private String brand;
    private String emoji;
    private Integer price;
    private Integer cost;
    private Integer profit;
    private Integer profitMargin;
    private Integer stock;
    private Integer sold;
    private List<String> tags;
    private String description;
    private String specs;
    private String sellingPoints;

    public static ProductSimpleDTO from(Product p) {
        ProductSimpleDTO dto = new ProductSimpleDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.brand = p.getBrand();
        dto.emoji = p.getEmoji();
        dto.price = p.getPrice();
        dto.cost = p.getCost();
        dto.profit = p.getPrice() - p.getCost();
        dto.profitMargin = Math.round((float)(p.getPrice() - p.getCost()) / p.getPrice() * 100);
        dto.stock = p.getStock();
        dto.sold = p.getSold();
        dto.tags = p.getTags() != null
            ? Arrays.stream(p.getTags().split(",")).map(String::trim).toList()
            : List.of();
        dto.description = p.getDescription();
        dto.specs = p.getSpecs();
        dto.sellingPoints = p.getSellingPoints();
        return dto;
    }
}
