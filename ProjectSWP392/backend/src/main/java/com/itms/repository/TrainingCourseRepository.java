package com.itms.repository;

import com.itms.entity.TrainingCourse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainingCourseRepository extends JpaRepository<TrainingCourse, Integer> {
    
    Optional<TrainingCourse> findByCode(String code);
    
    Page<TrainingCourse> findByCategoryIdAndStatusAndIsActive(Integer categoryId, String status, Boolean isActive, Pageable pageable);
    
    @Query("SELECT c FROM TrainingCourse c WHERE c.isActive = true AND c.status = 'PUBLISHED'")
    Page<TrainingCourse> findPublishedCourses(Pageable pageable);
    
    @Query("SELECT c FROM TrainingCourse c WHERE c.isActive = true AND c.status = 'PUBLISHED' AND c.isRequired = true")
    List<TrainingCourse> findRequiredCourses();
    
    @Query("SELECT c FROM TrainingCourse c WHERE c.categoryId = :categoryId AND c.isActive = true AND c.status = 'PUBLISHED'")
    Page<TrainingCourse> findByCategory(@Param("categoryId") Integer categoryId, Pageable pageable);
    
    @Query("SELECT DISTINCT c FROM TrainingCourse c JOIN CourseEnrollment ce ON c.id = ce.course.id WHERE ce.user.id = :userId")
    Page<TrainingCourse> findEnrolledCourses(@Param("userId") Integer userId, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM TrainingCourse c WHERE c.isActive = true AND c.status = 'PUBLISHED'")
    long countPublishedCourses();
}
