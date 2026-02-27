package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CourseEnrollment", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"course_id", "user_id"}, name = "UQ_CourseEnrollment_User_Course")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_Enrollment_Course"))
    private TrainingCourse course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_Enrollment_User"))
    private User user;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDateTime enrollmentDate;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(nullable = false, length = 20)
    private String status; // ENROLLED, IN_PROGRESS, COMPLETED, DROPPED

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;

    @Column(name = "completion_notes", columnDefinition = "NVARCHAR(MAX)")
    private String completionNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.enrollmentDate = (this.enrollmentDate == null) ? LocalDateTime.now() : this.enrollmentDate;
        this.status = (this.status == null) ? "ENROLLED" : this.status;
        this.progressPercentage = (this.progressPercentage == null) ? 0 : this.progressPercentage;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
