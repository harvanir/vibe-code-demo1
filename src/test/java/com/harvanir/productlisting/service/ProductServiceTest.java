package com.harvanir.productlisting.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.harvanir.productlisting.domain.dto.PagedResponseDto;
import com.harvanir.productlisting.domain.dto.ProductDetailResponseDto;
import com.harvanir.productlisting.domain.dto.ProductFilterRequestDto;
import com.harvanir.productlisting.domain.dto.ProductResponseDto;
import com.harvanir.productlisting.domain.dto.SingleResponseDto;
import com.harvanir.productlisting.domain.entity.Product;
import com.harvanir.productlisting.exception.InvalidFilterException;
import com.harvanir.productlisting.exception.ProductNotFoundException;
import com.harvanir.productlisting.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void findAll_withValidFilter_returnsPagedProductResponse() {
        Product product = Product.builder()
                .id(1L)
                .name("Wireless Mouse")
                .description("Ergonomic wireless mouse")
                .category("Electronics")
                .price(BigDecimal.valueOf(19.99))
                .build();

        when(productRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(product), PageRequest.of(0, 10), 1));

        PagedResponseDto<ProductResponseDto> result = productService.findAll(
                new ProductFilterRequestDto("Electronics", BigDecimal.valueOf(10), BigDecimal.valueOf(30), "mouse"),
                PageRequest.of(0, 10)
        );

        assertThat(result.data()).hasSize(1);
        assertThat(result.data().get(0).name()).isEqualTo("Wireless Mouse");
        assertThat(result.pagination().totalElements()).isEqualTo(1);
    }

    @Test
    void findAll_withInvalidPriceRange_throwsException() {
        assertThatThrownBy(() -> productService.findAll(
                new ProductFilterRequestDto(null, BigDecimal.valueOf(50), BigDecimal.valueOf(10), null),
                PageRequest.of(0, 10)
        )).isInstanceOf(InvalidFilterException.class)
                .hasMessage("minPrice must be less than or equal to maxPrice");
    }

    @Test
    void findById_productExists_returnsProductDetailDto() {
        Product product = Product.builder()
                .id(2L)
                .name("Desk Lamp")
                .description("LED lamp with brightness control")
                .category("Furniture")
                .price(BigDecimal.valueOf(24.75))
                .build();

        when(productRepository.findById(2L)).thenReturn(Optional.of(product));

        SingleResponseDto<ProductDetailResponseDto> result = productService.findById(2L);

        assertThat(result.data().id()).isEqualTo(2L);
        assertThat(result.data().description()).contains("brightness");
    }

    @Test
    void findById_productNotFound_throwsException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.findById(99L))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessage("Product with id 99 was not found");
    }
}