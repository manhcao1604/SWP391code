package com.itms.repository;

import com.itms.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseLessonRepository extends JpaRepository<CourseLesson, Integer> {
    
    @Query("SELECT l FROM CourseLesson l WHERE l.chapter.id = :chapterId AND l.isActive = true ORDER BY l.lessonOrder ASC")
    List<CourseLesson> findByChapterIdOrderByLessonOrder(@Param("chapterId") Integer chapterId);
    
    @Query("SELECT l FROM CourseLesson l WHERE l.course.id = :courseId AND l.isActive = true ORDER BY l.lessonOrder ASC")
    List<CourseLesson> findByCourseIdOrderByLessonOrder(@Param("courseId") Integer courseId);
}
