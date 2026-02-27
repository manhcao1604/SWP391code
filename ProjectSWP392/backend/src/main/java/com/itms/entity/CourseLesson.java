package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CourseLesson")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_CourseLesson_Chapter"))
    private CourseChapter chapter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_CourseLesson_Course"))
    private TrainingCourse course;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;

    @Column(name = "content_type", nullable = false, length = 20)
    private String contentType; // VIDEO, DOCUMENT, QUIZ, ASSIGNMENT, DISCUSSION

    @Column(name = "content_url", length = 500)
    private String contentUrl;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isActive = (this.isActive == null) ? true : this.isActive;
        this.durationMinutes = (this.durationMinutes == null) ? 0 : this.durationMinutes;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
