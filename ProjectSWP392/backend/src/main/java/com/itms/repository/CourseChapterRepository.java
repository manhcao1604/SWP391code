package com.itms.repository;

import com.itms.entity.CourseChapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseChapterRepository extends JpaRepository<CourseChapter, Integer> {
    
    @Query("SELECT c FROM CourseChapter c WHERE c.course.id = :courseId AND c.isActive = true ORDER BY c.chapterOrder ASC")
    List<CourseChapter> findByCourseIdOrderByChapterOrder(@Param("courseId") Integer courseId);
    
    @Query("SELECT c FROM CourseChapter c WHERE c.course.id = :courseId ORDER BY c.chapterOrder ASC")
    List<CourseChapter> findAllByCourseId(@Param("courseId") Integer courseId);
}
