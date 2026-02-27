package com.itms.dto.training;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Integer id;
    private String title;
    private String code;
    private String description;
    private String categoryName;
    private Integer categoryId;
    private String trainerName;
    private Integer trainerId;
    private String thumbnailUrl;
    private Integer durationHours;
    private String level;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxParticipants;
    private Integer totalStudents;
    private Integer totalCompleted;
    private Float averageRating;
    private Integer ratingCount;
    private Boolean isRequired;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CourseLessonDto> chapters;
    private Integer enrollmentStatus; // 0 = Not enrolled, 1 = Enrolled, 2 = In Progress, 3 = Completed
}
