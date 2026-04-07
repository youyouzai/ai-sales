package com.salesstar.dto;

import com.salesstar.entity.Task;
import lombok.Data;

@Data
public class TaskDTO {
    private Long id;
    private String content;
    private Boolean done;
    private Integer xp;

    public static TaskDTO from(Task t) {
        TaskDTO dto = new TaskDTO();
        dto.id = t.getId();
        dto.content = t.getContent();
        dto.done = t.getDone();
        dto.xp = t.getXp();
        return dto;
    }
}
