package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.service.EarningsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EarningsController {

    private final EarningsService earningsService;

    /** GET /api/earnings?userId=1 */
    @GetMapping("/earnings")
    public ApiResponse<Map<String, Object>> getEarnings(
            @RequestParam(defaultValue = "1") Long userId) {
        return ApiResponse.ok(earningsService.getEarnings(userId));
    }

    /** GET /api/leaderboard?userId=1&period=2024-01 */
    @GetMapping("/leaderboard")
    public ApiResponse<List<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(required = false) String period) {
        return ApiResponse.ok(earningsService.getLeaderboard(userId, period));
    }
}
