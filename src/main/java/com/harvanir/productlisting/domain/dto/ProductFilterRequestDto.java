package com.harvanir.productlisting.domain.dto;

import java.math.BigDecimal;

public record ProductFilterRequestDto(
        String category,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String keyword
) {
}
