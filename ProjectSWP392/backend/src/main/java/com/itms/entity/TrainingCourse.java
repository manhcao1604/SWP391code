package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TrainingCourse", uniqueConstraints = {
        @UniqueConstraint(columnNames = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_TrainingCourse_Category"))
    private TrainingCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", 
            foreignKey = @ForeignKey(name = "FK_TrainingCourse_Trainer"))
    private User trainer;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "duration_hours", nullable = false)
    private Integer durationHours;

    @Column(nullable = false, length = 20)
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    @Column(nullable = false, length = 20)
    private String status; // DRAFT, PUBLISHED, ARCHIVED

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "enrollment_deadline")
    private LocalDateTime enrollmentDeadline;

    @Column(name = "total_students", nullable = false)
    private Integer totalStudents;

    @Column(name = "total_completed", nullable = false)
    private Integer totalCompleted;

    @Column(name = "average_rating")
    private Float averageRating;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

    // Relationships
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<CourseChapter> chapters;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<CourseEnrollment> enrollments;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<CourseRating> ratings;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<TrainingAssignment> assignments;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isActive = (this.isActive == null) ? true : this.isActive;
        this.isRequired = (this.isRequired == null) ? false : this.isRequired;
        this.totalStudents = (this.totalStudents == null) ? 0 : this.totalStudents;
        this.totalCompleted = (this.totalCompleted == null) ? 0 : this.totalCompleted;
        this.ratingCount = (this.ratingCount == null) ? 0 : this.ratingCount;
        this.durationHours = (this.durationHours == null) ? 0 : this.durationHours;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
