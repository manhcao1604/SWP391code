package com.itms.controller;

import com.itms.dto.common.ResponseDto;
import com.itms.dto.training.CourseDto;
import com.itms.dto.training.EnrollmentDto;
import com.itms.entity.TrainingAssignment;
import com.itms.entity.TrainingCategory;
import com.itms.entity.TrainingNotification;
import com.itms.security.CustomUserDetails;
import com.itms.service.EmployeeTrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training")
@RequiredArgsConstructor
@Tag(name = "Employee Training", description = "Employee training management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class EmployeeTrainingController {

    private final EmployeeTrainingService trainingService;

    // ==================== CATEGORIES ====================

    @GetMapping("/categories")
    @Operation(summary = "Get all training categories")
    public ResponseEntity<ResponseDto<List<TrainingCategory>>> getAllCategories() {
        List<TrainingCategory> categories = trainingService.getAllCategories();
        return ResponseEntity.ok(ResponseDto.success(categories, "Categories retrieved successfully"));
    }

    // ==================== COURSES ====================

    @GetMapping("/courses")
    @Operation(summary = "Get all published courses with pagination")
    public ResponseEntity<ResponseDto<Page<CourseDto>>> getPublishedCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> courses = trainingService.getPublishedCourses(pageable, userId);

        return ResponseEntity.ok(ResponseDto.success(courses, "Courses retrieved successfully"));
    }

    @GetMapping("/courses/category/{categoryId}")
    @Operation(summary = "Get courses by category")
    public ResponseEntity<ResponseDto<Page<CourseDto>>> getCoursesByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> courses = trainingService.getCoursesByCategory(categoryId, pageable, userId);

        return ResponseEntity.ok(ResponseDto.success(courses, "Courses retrieved successfully"));
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "Get course details with chapters and lessons")
    public ResponseEntity<ResponseDto<CourseDto>> getCourseDetail(
            @PathVariable Integer courseId,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        CourseDto course = trainingService.getCourseDetail(courseId, userId);

        return ResponseEntity.ok(ResponseDto.success(course, "Course details retrieved successfully"));
    }

    @GetMapping("/courses/required")
    @Operation(summary = "Get required courses for employee")
    public ResponseEntity<ResponseDto<List<CourseDto>>> getRequiredCourses(
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        List<CourseDto> courses = trainingService.getRequiredCourses(userId);

        return ResponseEntity.ok(ResponseDto.success(courses, "Required courses retrieved successfully"));
    }

    // ==================== ENROLLMENT ====================

    @PostMapping("/enroll/{courseId}")
    @Operation(summary = "Enroll in a course")
    public ResponseEntity<ResponseDto<EnrollmentDto>> enrollInCourse(
            @PathVariable Integer courseId,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        EnrollmentDto enrollment = trainingService.enrollInCourse(userId, courseId);

        return ResponseEntity.ok(ResponseDto.success(enrollment, "Successfully enrolled in course"));
    }

    @GetMapping("/enrollments")
    @Operation(summary = "Get employee's enrolled courses")
    public ResponseEntity<ResponseDto<Page<CourseDto>>> getEnrolledCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseDto> courses = trainingService.getEnrolledCourses(userId, pageable);

        return ResponseEntity.ok(ResponseDto.success(courses, "Enrolled courses retrieved successfully"));
    }

    @GetMapping("/enrollments/{enrollmentId}")
    @Operation(summary = "Get enrollment details")
    public ResponseEntity<ResponseDto<EnrollmentDto>> getEnrollmentDetails(
            @PathVariable Integer enrollmentId) {

        EnrollmentDto enrollment = trainingService.getEnrollmentDetails(enrollmentId);
        return ResponseEntity.ok(ResponseDto.success(enrollment, "Enrollment details retrieved successfully"));
    }

    @GetMapping("/enrollments/course/{courseId}")
    @Operation(summary = "Get enrollment for specific course")
    public ResponseEntity<ResponseDto<EnrollmentDto>> getEnrollment(
            @PathVariable Integer courseId,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        EnrollmentDto enrollment = trainingService.getEnrollment(userId, courseId);

        return ResponseEntity.ok(ResponseDto.success(enrollment, "Enrollment retrieved successfully"));
    }

    @PutMapping("/enrollments/{enrollmentId}/progress")
    @Operation(summary = "Update enrollment progress")
    public ResponseEntity<ResponseDto<EnrollmentDto>> updateProgress(
            @PathVariable Integer enrollmentId,
            @RequestParam Integer progressPercentage) {

        EnrollmentDto enrollment = trainingService.updateEnrollmentProgress(enrollmentId, progressPercentage);
        return ResponseEntity.ok(ResponseDto.success(enrollment, "Progress updated successfully"));
    }

    @DeleteMapping("/enrollments/{enrollmentId}")
    @Operation(summary = "Drop course")
    public ResponseEntity<ResponseDto<Void>> dropCourse(@PathVariable Integer enrollmentId) {
        trainingService.dropCourse(enrollmentId);
        return ResponseEntity.ok(ResponseDto.success(null, "Course dropped successfully"));
    }

    // ==================== LESSON TRACKING ====================

    @PostMapping("/lessons/{lessonId}/complete")
    @Operation(summary = "Mark lesson as completed")
    public ResponseEntity<ResponseDto<Void>> completeLessonProgress(
            @PathVariable Integer lessonId,
            @RequestParam Integer enrollmentId,
            @RequestParam(defaultValue = "0") Integer timeSpent,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        trainingService.completeLessonProgress(lessonId, userId, enrollmentId, timeSpent);

        return ResponseEntity.ok(ResponseDto.success(null, "Lesson marked as completed"));
    }

    @GetMapping("/lessons/{lessonId}/status")
    @Operation(summary = "Get lesson completion status")
    public ResponseEntity<ResponseDto<Object>> getLessonStatus(
            @PathVariable Integer lessonId,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        var lessonStatus = trainingService.getLessonStatus(lessonId, userId);

        return ResponseEntity.ok(ResponseDto.success(lessonStatus, "Lesson status retrieved successfully"));
    }

    // ==================== RATINGS ====================

    @PostMapping("/courses/{courseId}/rate")
    @Operation(summary = "Rate a course")
    public ResponseEntity<ResponseDto<Void>> rateCourse(
            @PathVariable Integer courseId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        trainingService.rateCourse(courseId, userId, rating, comment);

        return ResponseEntity.ok(ResponseDto.success(null, "Course rated successfully"));
    }

    @GetMapping("/courses/{courseId}/ratings")
    @Operation(summary = "Get course ratings")
    public ResponseEntity<ResponseDto<Object>> getCourseRatings(
            @PathVariable Integer courseId) {

        var ratings = trainingService.getCourseRatings(courseId);
        return ResponseEntity.ok(ResponseDto.success(ratings, "Course ratings retrieved successfully"));
    }

    // ==================== ASSIGNMENTS ====================

    @GetMapping("/assignments")
    @Operation(summary = "Get all assignments for employee")
    public ResponseEntity<ResponseDto<Page<TrainingAssignment>>> getAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<TrainingAssignment> assignments = trainingService.getAssignments(userId, pageable);

        return ResponseEntity.ok(ResponseDto.success(assignments, "Assignments retrieved successfully"));
    }

    // ==================== NOTIFICATIONS ====================

    @GetMapping("/notifications")
    @Operation(summary = "Get user notifications")
    public ResponseEntity<ResponseDto<Page<TrainingNotification>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<TrainingNotification> notifications = trainingService.getNotifications(userId, pageable);

        return ResponseEntity.ok(ResponseDto.success(notifications, "Notifications retrieved successfully"));
    }

    @GetMapping("/notifications/unread/count")
    @Operation(summary = "Get unread notifications count")
    public ResponseEntity<ResponseDto<Long>> getUnreadNotificationCount(
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        long count = trainingService.getUnreadNotificationCount(userId);

        return ResponseEntity.ok(ResponseDto.success(count, "Unread notification count retrieved"));
    }

    @PutMapping("/notifications/{notificationId}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ResponseDto<Void>> markNotificationAsRead(
            @PathVariable Integer notificationId) {

        trainingService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok(ResponseDto.success(null, "Notification marked as read"));
    }

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get employee dashboard statistics")
    public ResponseEntity<ResponseDto<EmployeeTrainingService.DashboardStats>> getDashboardStats(
            Authentication authentication) {

        Integer userId = ((CustomUserDetails) authentication.getPrincipal()).getId();
        EmployeeTrainingService.DashboardStats stats = trainingService.getEmployeeDashboardStats(userId);

        return ResponseEntity.ok(ResponseDto.success(stats, "Dashboard statistics retrieved successfully"));
    }
}
