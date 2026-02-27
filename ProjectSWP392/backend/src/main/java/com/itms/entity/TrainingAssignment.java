package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TrainingAssignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_Assignment_Course"))
    private TrainingCourse course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, 
            foreignKey = @ForeignKey(name = "FK_Assignment_User"))
    private User user;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by", 
            foreignKey = @ForeignKey(name = "FK_Assignment_AssignedBy"))
    private User assignedBy;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false, length = 20)
    private String priority; // LOW, MEDIUM, HIGH, URGENT

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "completion_status", nullable = false, length = 20)
    private String completionStatus; // PENDING, COMPLETED, OVERDUE

    @Column(name = "notes", columnDefinition = "NVARCHAR(MAX)")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.assignedDate = (this.assignedDate == null) ? LocalDateTime.now() : this.assignedDate;
        this.completionStatus = (this.completionStatus == null) ? "PENDING" : this.completionStatus;
        this.priority = (this.priority == null) ? "MEDIUM" : this.priority;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
