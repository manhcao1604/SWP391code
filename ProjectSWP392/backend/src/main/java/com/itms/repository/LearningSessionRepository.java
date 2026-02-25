package com.itms.repository;

import com.itms.entity.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningSessionRepository extends JpaRepository<LearningSession, Integer> {
    List<LearningSession> findByCourseIdOrderBySessionDateAscStartTimeAsc(Integer courseId);
    List<LearningSession> findByCourseIdInOrderBySessionDateAscStartTimeAsc(List<Integer> courseIds);
}
