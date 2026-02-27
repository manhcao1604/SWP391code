package com.itms.repository;

import com.itms.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRatingRepository extends JpaRepository<CourseRating, Integer> {
    
    Optional<CourseRating> findByUserIdAndCourseId(Integer userId, Integer courseId);
    
    @Query("SELECT cr FROM CourseRating cr WHERE cr.course.id = :courseId ORDER BY cr.createdAt DESC")
    List<CourseRating> findByCourseId(@Param("courseId") Integer courseId);
    
    @Query("SELECT AVG(cr.rating) FROM CourseRating cr WHERE cr.course.id = :courseId")
    Double calculateAverageRating(@Param("courseId") Integer courseId);
}
