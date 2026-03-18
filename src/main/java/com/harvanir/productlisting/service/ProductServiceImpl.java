package com.harvanir.productlisting.service;

import com.harvanir.productlisting.domain.dto.PagedResponseDto;
import com.harvanir.productlisting.domain.dto.PaginationDto;
import com.harvanir.productlisting.domain.dto.ProductDetailResponseDto;
import com.harvanir.productlisting.domain.dto.ProductFilterRequestDto;
import com.harvanir.productlisting.domain.dto.ProductResponseDto;
import com.harvanir.productlisting.domain.dto.SingleResponseDto;
import com.harvanir.productlisting.domain.entity.Product;
import com.harvanir.productlisting.exception.InvalidFilterException;
import com.harvanir.productlisting.exception.ProductNotFoundException;
import com.harvanir.productlisting.repository.ProductRepository;
import com.harvanir.productlisting.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public PagedResponseDto<ProductResponseDto> findAll(ProductFilterRequestDto filter, Pageable pageable) {
        validateFilter(filter);

        Page<Product> productPage = productRepository.findAll(ProductSpecification.withFilters(filter), pageable);

        return new PagedResponseDto<>(
                productPage.stream().map(this::toProductResponseDto).toList(),
                new PaginationDto(
                        productPage.getNumber(),
                        productPage.getSize(),
                        productPage.getTotalElements(),
                        productPage.getTotalPages()
                )
        );
    }

    @Override
    public SingleResponseDto<ProductDetailResponseDto> findById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        return new SingleResponseDto<>(toProductDetailResponseDto(product));
    }

    private void validateFilter(ProductFilterRequestDto filter) {
        if (filter == null) {
            return;
        }

        if (filter.minPrice() != null && filter.maxPrice() != null && filter.minPrice().compareTo(filter.maxPrice()) > 0) {
            throw new InvalidFilterException("minPrice must be less than or equal to maxPrice");
        }
    }

    private ProductResponseDto toProductResponseDto(Product product) {
        return new ProductResponseDto(product.getId(), product.getName(), product.getPrice(), product.getCategory());
    }

    private ProductDetailResponseDto toProductDetailResponseDto(Product product) {
        return new ProductDetailResponseDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory()
        );
    }
}