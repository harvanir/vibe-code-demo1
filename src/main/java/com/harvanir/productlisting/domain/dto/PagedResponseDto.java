package com.harvanir.productlisting.domain.dto;

import java.util.List;

public record PagedResponseDto<T>(
        List<T> data,
        PaginationDto pagination
) {
}
