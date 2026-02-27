package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "LessonCompletion", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"lesson_id", "user_id"}, name = "UQ_LessonCompletion_User_Lesson")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_LessonCompletion_Lesson"))
    private CourseLesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_LessonCompletion_User"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_LessonCompletion_Enrollment"))
    private CourseEnrollment enrollment;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(nullable = false, length = 20)
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED

    @Column(name = "time_spent_minutes", nullable = false)
    private Integer timeSpentMinutes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = (this.status == null) ? "NOT_STARTED" : this.status;
        this.timeSpentMinutes = (this.timeSpentMinutes == null) ? 0 : this.timeSpentMinutes;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
