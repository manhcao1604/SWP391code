package com.itms.repository;

import com.itms.entity.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseFeedbackRepository extends JpaRepository<CourseFeedback, Integer> {
    List<CourseFeedback> findByUserIdOrderByCreatedAtDesc(Integer userId);
    Optional<CourseFeedback> findByEnrollmentIdAndSessionId(Integer enrollmentId, Integer sessionId);
}
