package com.itms.repository;

import com.itms.entity.EmployeeEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeEnrollmentRepository extends JpaRepository<EmployeeEnrollment, Integer> {
    List<EmployeeEnrollment> findByEmployeeIdOrderByRegisteredAtDesc(Integer employeeId);
    Optional<EmployeeEnrollment> findByEmployeeIdAndSessionId(Integer employeeId, Integer sessionId);
}
