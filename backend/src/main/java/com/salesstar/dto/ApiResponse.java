package com.salesstar.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = 200;
        r.message = "success";
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = 500;
        r.message = message;
        return r;
    }

    public static <T> ApiResponse<T> notFound(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.code = 404;
        r.message = message;
        return r;
    }
}
