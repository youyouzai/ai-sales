package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.dto.DashboardDTO;
import com.salesstar.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /** GET /api/dashboard?userId=1 */
    @GetMapping
    public ApiResponse<DashboardDTO> getDashboard(@RequestParam(defaultValue = "1") Long userId) {
        return ApiResponse.ok(dashboardService.getDashboard(userId));
    }
}
