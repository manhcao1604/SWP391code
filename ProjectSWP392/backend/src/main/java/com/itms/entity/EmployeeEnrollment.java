package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Enrollment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private LearningSession session;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "completion_rate")
    private Double completionRate;

    @Column(name = "final_score")
    private Double finalScore;

    @Column(name = "certificate_issued", nullable = false)
    private Boolean certificateIssued;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @PrePersist
    protected void onCreate() {
        this.status = this.status == null ? "REGISTERED" : this.status;
        this.certificateIssued = this.certificateIssued == null ? false : this.certificateIssued;
    }
}
