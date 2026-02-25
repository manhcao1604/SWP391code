package com.itms.repository;

import com.itms.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    List<Certificate> findByEnrollmentEmployeeIdAndIsValidTrue(Integer employeeId);
}
