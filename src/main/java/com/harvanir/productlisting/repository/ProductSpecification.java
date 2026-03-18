package com.harvanir.productlisting.repository;

import com.harvanir.productlisting.domain.dto.ProductFilterRequestDto;
import com.harvanir.productlisting.domain.entity.Product;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

@Slf4j
public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> withFilters(ProductFilterRequestDto filter) {
        return (root, query, criteriaBuilder) -> {
            if (filter == null) {
                return null;
            }

            Predicate predicate = null;

            if (StringUtils.hasText(filter.category())) {
                Predicate categoryPredicate = criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("category")),
                        filter.category().trim().toLowerCase()
                );
                predicate = predicate == null ? categoryPredicate : criteriaBuilder.and(predicate, categoryPredicate);
            }

            if (filter.minPrice() != null) {
                Predicate minPricePredicate = criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.minPrice());
                predicate = predicate == null ? minPricePredicate : criteriaBuilder.and(predicate, minPricePredicate);
            }

            if (filter.maxPrice() != null) {
                Predicate maxPricePredicate = criteriaBuilder.lessThanOrEqualTo(root.get("price"), filter.maxPrice());
                predicate = predicate == null ? maxPricePredicate : criteriaBuilder.and(predicate, maxPricePredicate);
            }

            if (StringUtils.hasText(filter.keyword())) {
                Predicate keywordPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filter.keyword().trim().toLowerCase() + "%"
                );
                predicate = predicate == null ? keywordPredicate : criteriaBuilder.and(predicate, keywordPredicate);
            }

            return predicate;
        };
    }
}