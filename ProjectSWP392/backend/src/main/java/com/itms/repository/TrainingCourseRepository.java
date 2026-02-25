package com.itms.repository;

import com.itms.entity.TrainingCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainingCourseRepository extends JpaRepository<TrainingCourse, Integer> {
    Optional<TrainingCourse> findByCode(String code);
}
