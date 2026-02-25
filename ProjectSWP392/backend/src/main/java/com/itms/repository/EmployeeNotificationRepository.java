package com.itms.repository;

import com.itms.entity.EmployeeNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeNotificationRepository extends JpaRepository<EmployeeNotification, Integer> {
    List<EmployeeNotification> findByEmployeeIdOrderByCreatedAtDesc(Integer employeeId);
}
