package com.itms.repository;

import com.itms.entity.CourseEnrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Integer> {
    
    Optional<CourseEnrollment> findByUserIdAndCourseId(Integer userId, Integer courseId);
    
    Page<CourseEnrollment> findByUserId(Integer userId, Pageable pageable);
    
    Page<CourseEnrollment> findByUserIdAndStatus(Integer userId, String status, Pageable pageable);
    
    @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.course.id = :courseId")
    Optional<CourseEnrollment> getEnrollment(@Param("userId") Integer userId, @Param("courseId") Integer courseId);
    
    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.course.id = :courseId AND ce.status IN ('COMPLETED')")
    long countCompletedEnrollments(@Param("courseId") Integer courseId);
    
    @Query("SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.course.id = :courseId")
    long countTotalEnrollments(@Param("courseId") Integer courseId);
    
    @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.user.id = :userId AND ce.status NOT IN ('COMPLETED', 'DROPPED')")
    List<CourseEnrollment> findActiveEnrollments(@Param("userId") Integer userId);
}
