package com.salesstar.controller;

import com.salesstar.dto.ApiResponse;
import com.salesstar.dto.TaskDTO;
import com.salesstar.entity.Task;
import com.salesstar.entity.User;
import com.salesstar.repository.TaskRepository;
import com.salesstar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    /** GET /api/tasks?userId=1 */
    @GetMapping
    public ApiResponse<List<TaskDTO>> getTodayTasks(
            @RequestParam(defaultValue = "1") Long userId) {
        List<TaskDTO> tasks = taskRepository
                .findByUserIdAndTaskDateOrderByIdAsc(userId, LocalDate.now())
                .stream().map(TaskDTO::from).toList();
        return ApiResponse.ok(tasks);
    }

    /** PUT /api/tasks/{id}/toggle */
    @PutMapping("/{id}/toggle")
    @Transactional
    public ApiResponse<TaskDTO> toggleTask(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("任务不存在"));
        boolean wasDone = task.getDone();
        task.setDone(!wasDone);
        taskRepository.save(task);

        // 完成任务时加 XP
        if (!wasDone) {
            userRepository.findById(userId).ifPresent(user -> {
                user.setXp(user.getXp() + task.getXp());
                userRepository.save(user);
            });
        }
        return ApiResponse.ok(TaskDTO.from(task));
    }
}
