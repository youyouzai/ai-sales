package com.salesstar.service;

import com.salesstar.dto.DashboardDTO;
import com.salesstar.dto.ProductSimpleDTO;
import com.salesstar.dto.TaskDTO;
import com.salesstar.entity.User;
import com.salesstar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final TaskRepository taskRepository;
    private final LeaderboardRepository leaderboardRepository;

    public DashboardDTO getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        DashboardDTO dto = new DashboardDTO();

        // 用户信息
        DashboardDTO.UserSummary us = new DashboardDTO.UserSummary();
        us.setId(user.getId());
        us.setName(user.getName());
        us.setAvatar(user.getAvatar());
        us.setRole(user.getRole());
        us.setStreak(user.getStreak());
        us.setXp(user.getXp());

        String period = YearMonth.now().toString();
        var lb = leaderboardRepository.findByPeriodOrderByRank(period);
        lb.stream().filter(l -> l.getUser().getId().equals(userId))
                .findFirst().ifPresent(l -> us.setRank(l.getRank()));
        dto.setUser(us);

        // 收益
        DashboardDTO.EarningsSummary es = new DashboardDTO.EarningsSummary();
        es.setBase(user.getBaseSalary());
        es.setCommission(user.getCommission());
        es.setBonus(user.getBonus());
        int total = user.getBaseSalary() + user.getCommission() + user.getBonus();
        es.setTotal(total);
        int dayOfMonth = LocalDate.now().getDayOfMonth();
        int daysInMonth = YearMonth.now().lengthOfMonth();
        es.setProjected((int)(total * ((double) daysInMonth / dayOfMonth) * 0.9));
        dto.setEarnings(es);

        // 目标
        DashboardDTO.GoalSummary gs = new DashboardDTO.GoalSummary();
        gs.setTarget(user.getTarget());
        gs.setDone(user.getDone());
        gs.setPct(user.getTarget() > 0
                ? Math.min(100, user.getDone() * 100 / user.getTarget()) : 0);
        gs.setDaysLeft(daysInMonth - dayOfMonth);
        dto.setGoal(gs);

        // 今日任务
        List<TaskDTO> tasks = taskRepository
                .findByUserIdAndTaskDateOrderByIdAsc(userId, LocalDate.now())
                .stream().map(TaskDTO::from).toList();
        dto.setTasks(tasks);

        // 爆款商品（按利润降序 Top 5）
        List<ProductSimpleDTO> hotProducts = productRepository.findAllOrderByProfitDesc()
                .stream().limit(5).map(ProductSimpleDTO::from).toList();
        dto.setHotProducts(hotProducts);

        // 近7日趋势（模拟，实际可按 order_date 聚合）
        dto.setTrendData(buildTrendData(userId));

        return dto;
    }

    private List<Integer> buildTrendData(Long userId) {
        // 统计近7天每天完成的订单数
        List<Integer> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            long count = orderRepository.findByUserIdWithProduct(userId).stream()
                    .filter(o -> day.equals(o.getOrderDate()) && "completed".equals(o.getStatus()))
                    .count();
            trend.add((int) count);
        }
        return trend;
    }
}
