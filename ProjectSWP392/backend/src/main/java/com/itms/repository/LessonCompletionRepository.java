package com.itms.repository;

import com.itms.entity.LessonCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Integer> {
    
    Optional<LessonCompletion> findByUserIdAndLessonId(Integer userId, Integer lessonId);
    
    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.enrollment.id = :enrollmentId AND lc.status = 'COMPLETED'")
    long countCompletedLessons(@Param("enrollmentId") Integer enrollmentId);
    
    @Query("SELECT COUNT(lc) FROM LessonCompletion lc WHERE lc.enrollment.course.id = :courseId AND lc.user.id = :userId")
    long countLessonsByUserAndCourse(@Param("userId") Integer userId, @Param("courseId") Integer courseId);
    
    @Query("SELECT lc FROM LessonCompletion lc WHERE lc.enrollment.id = :enrollmentId ORDER BY lc.lesson.lessonOrder")
    List<LessonCompletion> findByEnrollmentId(@Param("enrollmentId") Integer enrollmentId);
}
