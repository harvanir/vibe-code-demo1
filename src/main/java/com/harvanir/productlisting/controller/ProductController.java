package com.harvanir.productlisting.controller;

import com.harvanir.productlisting.domain.dto.PagedResponseDto;
import com.harvanir.productlisting.domain.dto.ProductDetailResponseDto;
import com.harvanir.productlisting.domain.dto.ProductFilterRequestDto;
import com.harvanir.productlisting.domain.dto.ProductResponseDto;
import com.harvanir.productlisting.domain.dto.SingleResponseDto;
import com.harvanir.productlisting.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 50;

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<PagedResponseDto<ProductResponseDto>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        int sanitizedPage = Math.max(page, DEFAULT_PAGE);
        int sanitizedSize = size <= 0 ? DEFAULT_SIZE : Math.min(size, MAX_PAGE_SIZE);
        Pageable pageable = PageRequest.of(sanitizedPage, sanitizedSize, Sort.by(Sort.Direction.ASC, "id"));
        ProductFilterRequestDto filter = new ProductFilterRequestDto(category, minPrice, maxPrice, keyword);

        return ResponseEntity.ok(productService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SingleResponseDto<ProductDetailResponseDto>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }
}