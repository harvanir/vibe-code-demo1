package com.harvanir.productlisting.domain.dto;

public record PaginationDto(
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
