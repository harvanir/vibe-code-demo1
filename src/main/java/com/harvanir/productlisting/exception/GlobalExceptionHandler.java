package com.harvanir.productlisting.exception;

import com.harvanir.productlisting.domain.dto.ErrorDetailDto;
import com.harvanir.productlisting.domain.dto.ErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleProductNotFound(ProductNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponseDto(new ErrorDetailDto("PRODUCT_NOT_FOUND", exception.getMessage())));
    }

    @ExceptionHandler(InvalidFilterException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidFilter(InvalidFilterException exception) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponseDto(new ErrorDetailDto("INVALID_FILTER", exception.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + error.getDefaultMessage())
                .orElse("Validation error");

        return ResponseEntity.badRequest()
                .body(new ErrorResponseDto(new ErrorDetailDto("VALIDATION_ERROR", message)));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneric(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponseDto(new ErrorDetailDto("INTERNAL_SERVER_ERROR", "Unexpected error occurred")));
    }
}
