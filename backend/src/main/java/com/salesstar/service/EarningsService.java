package com.salesstar.service;

import com.salesstar.entity.Leaderboard;
import com.salesstar.entity.User;
import com.salesstar.repository.LeaderboardRepository;
import com.salesstar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EarningsService {

    private final UserRepository userRepository;
    private final LeaderboardRepository leaderboardRepository;

    public Map<String, Object> getEarnings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        int total = user.getBaseSalary() + user.getCommission() + user.getBonus();
        int dayOfMonth = java.time.LocalDate.now().getDayOfMonth();
        int daysInMonth = YearMonth.now().lengthOfMonth();
        int projected = (int)(total * ((double) daysInMonth / dayOfMonth) * 0.9);

        // 里程碑
        List<Map<String, Object>> milestones = List.of(
            Map.of("icon","🥉","name","初级销售","desc","完成10台手机销售","target",10,"current",user.getDone(),"reward","¥500奖金"),
            Map.of("icon","🥈","name","中级达人","desc","完成25台手机销售","target",25,"current",user.getDone(),"reward","¥1,500奖金"),
            Map.of("icon","🥇","name","高级精英","desc","完成40台手机销售","target",40,"current",user.getDone(),"reward","¥3,000奖金"),
            Map.of("icon","👑","name","销售之王","desc","完成50台手机销售","target",50,"current",user.getDone(),"reward","¥5,000奖金+度假"),
            Map.of("icon","💎","name","传奇销售","desc","完成80台手机销售","target",80,"current",user.getDone(),"reward","¥10,000奖金+晋升")
        );

        // 近6月历史（模拟，实际可从 leaderboard 表聚合）
        List<Map<String, Object>> history = buildMonthlyHistory(userId);

        return Map.of(
            "base",       user.getBaseSalary(),
            "commission", user.getCommission(),
            "bonus",      user.getBonus(),
            "total",      total,
            "projected",  projected,
            "milestones", milestones,
            "history",    history
        );
    }

    private List<Map<String, Object>> buildMonthlyHistory(Long userId) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth current = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            String period = ym.toString();
            String label = ym.getMonthValue() + "月";
            var lb = leaderboardRepository.findByPeriodOrderByRank(period);
            long amount = lb.stream()
                    .filter(l -> l.getUser().getId().equals(userId))
                    .mapToLong(Leaderboard::getSalesAmount)
                    .findFirst().orElse(0L);
            result.add(Map.of("month", label, "amount", amount));
        }
        return result;
    }

    public List<Map<String, Object>> getLeaderboard(Long userId, String period) {
        String p = (period == null || period.isBlank()) ? YearMonth.now().toString() : period;
        return leaderboardRepository.findByPeriodOrderByRank(p).stream()
                .map(l -> {
                    boolean isMe = l.getUser().getId().equals(userId);
                    return Map.<String, Object>of(
                        "userId",      l.getUser().getId(),
                        "name",        l.getUser().getName(),
                        "avatar",      l.getUser().getAvatar() != null ? l.getUser().getAvatar() : l.getUser().getName().substring(0, 1),
                        "salesCount",  l.getSalesCount(),
                        "salesAmount", l.getSalesAmount(),
                        "rank",        l.getRank(),
                        "trend",       l.getTrend() != null ? l.getTrend() : "neutral",
                        "isMe",        isMe
                    );
                }).toList();
    }
}
