package com.salesstar.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardDTO {
    private UserSummary user;
    private EarningsSummary earnings;
    private GoalSummary goal;
    private List<TaskDTO> tasks;
    private List<ProductSimpleDTO> hotProducts;
    private List<Integer> trendData;   // 近7日销量

    @Data
    public static class UserSummary {
        private Long id;
        private String name;
        private String avatar;
        private String role;
        private Integer streak;
        private Integer xp;
        private Integer rank;
    }

    @Data
    public static class EarningsSummary {
        private Integer base;
        private Integer commission;
        private Integer bonus;
        private Integer total;
        private Integer projected;
    }

    @Data
    public static class GoalSummary {
        private Integer target;
        private Integer done;
        private Integer pct;
        private Integer daysLeft;
    }
}
