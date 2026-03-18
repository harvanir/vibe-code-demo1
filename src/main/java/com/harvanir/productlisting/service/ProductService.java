package com.harvanir.productlisting.service;

import com.harvanir.productlisting.domain.dto.PagedResponseDto;
import com.harvanir.productlisting.domain.dto.ProductDetailResponseDto;
import com.harvanir.productlisting.domain.dto.ProductFilterRequestDto;
import com.harvanir.productlisting.domain.dto.ProductResponseDto;
import com.harvanir.productlisting.domain.dto.SingleResponseDto;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    PagedResponseDto<ProductResponseDto> findAll(ProductFilterRequestDto filter, Pageable pageable);

    SingleResponseDto<ProductDetailResponseDto> findById(Long productId);
}
