package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TrainingNotification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_Notification_User"))
    private User user;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType; // COURSE_ENROLLED, COURSE_STARTED, LESSON_COMPLETED, COURSE_COMPLETED, ASSIGNMENT_DUE

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_course_id", 
            foreignKey = @ForeignKey(name = "FK_Notification_Course"))
    private TrainingCourse relatedCourse;

    @Column(name = "related_assignment_id")
    private Integer relatedAssignmentId;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isRead = (this.isRead == null) ? false : this.isRead;
    }
}
