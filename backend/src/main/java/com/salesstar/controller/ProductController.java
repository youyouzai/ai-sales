package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.dto.ProductSimpleDTO;
import com.salesstar.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products?brand=Apple&keyword=iPhone&sort=profit_desc
     */
    @GetMapping
    public ApiResponse<List<ProductSimpleDTO>> getProducts(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "profit_desc") String sort) {
        return ApiResponse.ok(productService.getProducts(brand, keyword, sort));
    }

    /** GET /api/products/{id} */
    @GetMapping("/{id}")
    public ApiResponse<ProductSimpleDTO> getProduct(@PathVariable Long id) {
        return ApiResponse.ok(productService.getProduct(id));
    }
}
