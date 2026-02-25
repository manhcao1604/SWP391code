package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private TrainingCourse course;

    @Column(name = "session_name", nullable = false, length = 255)
    private String topic;

    @Column(name = "date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "time_start", nullable = false)
    private LocalTime startTime;

    @Column(name = "time_end", nullable = false)
    private LocalTime endTime;

    @Column(name = "meeting_link", length = 500)
    private String meetingUrl;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @PrePersist
    protected void onCreate() {
        this.status = this.status == null ? "SCHEDULED" : this.status;
    }
}
