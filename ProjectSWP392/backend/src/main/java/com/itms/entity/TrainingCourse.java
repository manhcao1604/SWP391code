package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Course")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 20, unique = true)
    private String code;

    @Column(name = "name", nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(length = 20)
    private String level;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "passing_score")
    private Double passingScore;

    @Column(name = "duration_hours")
    private Double durationHours;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.status = this.status == null ? "ACTIVE" : this.status;
    }
}
