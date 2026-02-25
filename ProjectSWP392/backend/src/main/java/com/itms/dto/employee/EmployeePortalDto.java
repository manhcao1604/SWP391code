package com.itms.dto.employee;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmployeePortalDto {
    private Summary summary;
    private List<ScheduleItem> schedule;
    private List<CourseItem> courses;
    private List<ResultItem> results;
    private List<FeedbackItem> feedbacks;
    private List<NotificationItem> notifications;

    @Data
    @Builder
    public static class Summary {
        private int activeCourses;
        private int completedCourses;
        private int averageProgress;
        private int certificates;
    }

    @Data
    @Builder
    public static class ScheduleItem {
        private Integer enrollmentId;
        private String courseTitle;
        private String topic;
        private String sessionDate;
        private String startTime;
        private String endTime;
    }

    @Data
    @Builder
    public static class CourseItem {
        private Integer enrollmentId;
        private Integer sessionId;
        private Integer courseId;
        private String title;
        private String category;
        private int progressPercent;
        private String completionStatus;
    }

    @Data
    @Builder
    public static class ResultItem {
        private Integer enrollmentId;
        private String title;
        private Integer finalScore;
        private String completionStatus;
        private boolean canDownloadCertificate;
    }

    @Data
    @Builder
    public static class FeedbackItem {
        private Integer id;
        private String courseTitle;
        private int rating;
        private String comment;
        private String createdAt;
    }

    @Data
    @Builder
    public static class NotificationItem {
        private Integer id;
        private String title;
        private String message;
        private String type;
        private boolean read;
        private String createdAt;
    }
}
