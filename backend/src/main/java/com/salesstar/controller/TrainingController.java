package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.entity.LearningPath;
import com.salesstar.entity.QuizQuestion;
import com.salesstar.entity.SalesTip;
import com.salesstar.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class TrainingController {

    private final TrainingService trainingService;

    /** GET /api/training/tips?category=open */
    @GetMapping("/tips")
    public ApiResponse<List<SalesTip>> getTips(
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(trainingService.getTips(category));
    }

    /** GET /api/training/quiz */
    @GetMapping("/quiz")
    public ApiResponse<QuizQuestion> getQuiz() {
        return ApiResponse.ok(trainingService.getRandomQuiz());
    }

    /** POST /api/training/quiz/{id}/submit */
    @PostMapping("/quiz/{id}/submit")
    public ApiResponse<Map<String, Object>> submitQuiz(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody Map<String, Integer> body) {
        Integer selected = body.get("selected");
        if (selected == null) return ApiResponse.error("selected 不能为空");
        return ApiResponse.ok(trainingService.submitQuiz(userId, id, selected));
    }

    /** GET /api/training/path */
    @GetMapping("/path")
    public ApiResponse<List<LearningPath>> getLearningPath() {
        return ApiResponse.ok(trainingService.getLearningPath());
    }

    /** GET /api/training/daily-tip */
    @GetMapping("/daily-tip")
    public ApiResponse<String> getDailyTip() {
        return ApiResponse.ok(trainingService.getDailyTip());
    }
}
