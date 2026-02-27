package com.itms.dto.training;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonDto {
    private Integer id;
    private String title;
    private Integer chapterOrder;
    private String description;
    private Integer durationMinutes;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<LessonItemDto> lessons;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LessonItemDto {
        private Integer id;
        private String title;
        private Integer lessonOrder;
        private String contentType;
        private String contentUrl;
        private Integer durationMinutes;
        private String description;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private Boolean isCompleted;
        private Integer timeSpentMinutes;
    }
}
