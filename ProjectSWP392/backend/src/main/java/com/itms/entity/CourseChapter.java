package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CourseChapter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseChapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_CourseChapter_Course"))
    private TrainingCourse course;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "chapter_order", nullable = false)
    private Integer chapterOrder;

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

    @OneToMany(mappedBy = "chapter", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<CourseLesson> lessons;

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
