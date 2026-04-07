package com.salesstar.service;

import com.salesstar.dto.ProductSimpleDTO;
import com.salesstar.entity.Product;
import com.salesstar.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductSimpleDTO> getProducts(String brand, String keyword, String sort) {
        List<Product> list;

        if (keyword != null && !keyword.isBlank()) {
            list = productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(keyword, keyword);
        } else if (brand != null && !brand.isBlank() && !"all".equalsIgnoreCase(brand)) {
            list = productRepository.findByBrandIgnoreCase(brand);
        } else {
            list = productRepository.findAll();
        }

        // 排序
        Comparator<Product> comparator = switch (sort == null ? "profit_desc" : sort) {
            case "profit_asc"  -> Comparator.comparingInt(p -> (p.getPrice() - p.getCost()));
            case "price_desc"  -> Comparator.comparingInt(Product::getPrice).reversed();
            case "price_asc"   -> Comparator.comparingInt(Product::getPrice);
            case "stock_desc"  -> Comparator.comparingInt(Product::getStock).reversed();
            default            -> Comparator.comparingInt((Product p) -> (p.getPrice() - p.getCost())).reversed();
        };

        return list.stream().sorted(comparator).map(ProductSimpleDTO::from).toList();
    }

    public ProductSimpleDTO getProduct(Long id) {
        return productRepository.findById(id)
                .map(ProductSimpleDTO::from)
                .orElseThrow(() -> new RuntimeException("商品不存在：" + id));
    }
}
