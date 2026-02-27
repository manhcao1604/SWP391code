package com.itms.dto.training;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDto {
    private Integer id;
    private Integer courseId;
    private String courseTitle;
    private String courseThumbnail;
    private Integer userId;
    private LocalDateTime enrollmentDate;
    private LocalDateTime startDate;
    private LocalDateTime completionDate;
    private String status;
    private Integer progressPercentage;
    private String certificateUrl;
    private String completionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
