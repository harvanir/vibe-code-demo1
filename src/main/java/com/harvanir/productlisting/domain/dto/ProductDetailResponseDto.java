package com.harvanir.productlisting.domain.dto;

import java.math.BigDecimal;

public record ProductDetailResponseDto(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String category
) {
}
