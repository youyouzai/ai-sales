package com.salesstar.service;

import com.salesstar.entity.LearningPath;
import com.salesstar.entity.QuizQuestion;
import com.salesstar.entity.SalesTip;
import com.salesstar.entity.User;
import com.salesstar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TrainingService {

    private final SalesTipRepository tipRepository;
    private final QuizQuestionRepository quizRepository;
    private final LearningPathRepository pathRepository;
    private final UserRepository userRepository;

    public List<SalesTip> getTips(String category) {
        if (category != null && !category.isBlank() && !"all".equals(category)) {
            return tipRepository.findByCategoryOrderBySortOrderAsc(category);
        }
        return tipRepository.findAllByOrderBySortOrderAsc();
    }

    public QuizQuestion getRandomQuiz() {
        return quizRepository.findRandom()
                .orElseThrow(() -> new RuntimeException("暂无题目"));
    }

    public List<LearningPath> getLearningPath() {
        return pathRepository.findAllByOrderBySortOrderAsc();
    }

    public String getDailyTip() {
        List<String> tips = List.of(
            "第一印象决定70%的成交概率。进门前深呼吸，面带微笑，保持自信！",
            "倾听客户说话时，用眼睛看着客户，适时点头，让客户感受到被重视。",
            "永远不要贬低竞品，而是突出自己产品的独特优势。",
            "成交后立即做转介绍铺垫：'您满意的话，欢迎介绍朋友来！'",
            "每天记录3个成功案例，找出规律，复制成功！",
            "客户犹豫时，用故事代替数据，更容易打动人心。",
            "及时跟进是成交的关键，24小时内回访比72小时后回访成功率高3倍。"
        );
        int dayOfYear = java.time.LocalDate.now().getDayOfYear();
        return tips.get(dayOfYear % tips.size());
    }

    @Transactional
    public Map<String, Object> submitQuiz(Long userId, Long quizId, Integer selected) {
        QuizQuestion quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("题目不存在"));

        boolean correct = quiz.getCorrectIndex().equals(selected);
        if (correct) {
            userRepository.findById(userId).ifPresent(user -> {
                user.setXp(user.getXp() + quiz.getXpReward());
                userRepository.save(user);
            });
        }

        return Map.of(
            "correct", correct,
            "correctIndex", quiz.getCorrectIndex(),
            "explanation", quiz.getExplanation(),
            "xpEarned", correct ? quiz.getXpReward() : 0
        );
    }
}
