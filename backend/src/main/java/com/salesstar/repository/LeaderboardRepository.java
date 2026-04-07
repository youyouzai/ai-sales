package com.salesstar.repository;

import com.salesstar.entity.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {

    @Query("SELECT l FROM Leaderboard l JOIN FETCH l.user WHERE l.period = :period ORDER BY l.rank ASC")
    List<Leaderboard> findByPeriodOrderByRank(@Param("period") String period);
}
