package com.itms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Certificate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private EmployeeEnrollment enrollment;

    @Column(name = "certificate_code", nullable = false, unique = true, length = 50)
    private String certificateCode;

    @Column(name = "certificate_url", length = 500)
    private String certificateUrl;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "is_valid", nullable = false)
    private Boolean isValid;

    @PrePersist
    protected void onCreate() {
        this.issueDate = this.issueDate == null ? LocalDate.now() : this.issueDate;
        this.isValid = this.isValid == null ? true : this.isValid;
    }
}
