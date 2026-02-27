package com.itms.service;

import com.itms.dto.training.CourseDto;
import com.itms.dto.training.CourseLessonDto;
import com.itms.dto.training.EnrollmentDto;
import com.itms.entity.*;
import com.itms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeTrainingService {

    private final TrainingCourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseChapterRepository chapterRepository;
    private final CourseLessonRepository lessonRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final CourseRatingRepository ratingRepository;
    private final TrainingCategoryRepository categoryRepository;
    private final TrainingAssignmentRepository assignmentRepository;
    private final TrainingNotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ==================== COURSE MANAGEMENT ====================

    /**
     * Get all published training categories
     */
    public List<TrainingCategory> getAllCategories() {
        return categoryRepository.findActiveCategories();
    }

    /**
     * Get all published courses with pagination
     */
    public Page<CourseDto> getPublishedCourses(Pageable pageable, Integer userId) {
        return courseRepository.findPublishedCourses(pageable)
                .map(course -> convertToCourseDto(course, userId));
    }

    /**
     * Get courses by category
     */
    public Page<CourseDto> getCoursesByCategory(Integer categoryId, Pageable pageable, Integer userId) {
        return courseRepository.findByCategory(categoryId, pageable)
                .map(course -> convertToCourseDto(course, userId));
    }

    /**
     * Get course details with all chapters and lessons
     */
    public CourseDto getCourseDetail(Integer courseId, Integer userId) {
        TrainingCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseDto courseDto = convertToCourseDto(course, userId);

        // Get chapters with lessons
        List<CourseChapter> chapters = chapterRepository.findByCourseIdOrderByChapterOrder(courseId);
        List<CourseLessonDto> chapterDtos = chapters.stream()
                .map(chapter -> convertToChapterDto(chapter, userId))
                .collect(Collectors.toList());

        courseDto.setChapters(chapterDtos);
        return courseDto;
    }

    /**
     * Get all required courses for employee
     */
    public List<CourseDto> getRequiredCourses(Integer userId) {
        return courseRepository.findRequiredCourses().stream()
                .map(course -> convertToCourseDto(course, userId))
                .collect(Collectors.toList());
    }

    // ==================== ENROLLMENT MANAGEMENT ====================

    /**
     * Enroll an employee in a course
     */
    @Transactional
    public EnrollmentDto enrollInCourse(Integer userId, Integer courseId) {
        TrainingCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already enrolled
        if (enrollmentRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
            throw new RuntimeException("User already enrolled in this course");
        }

        // Check max participants
        if (course.getMaxParticipants() != null) {
            long currentEnrollments = enrollmentRepository.countTotalEnrollments(courseId);
            if (currentEnrollments >= course.getMaxParticipants()) {
                throw new RuntimeException("Course is full");
            }
        }

        // Create enrollment
        CourseEnrollment enrollment = CourseEnrollment.builder()
                .course(course)
                .user(user)
                .status("ENROLLED")
                .progressPercentage(0)
                .build();

        enrollment = enrollmentRepository.save(enrollment);

        // Update course metrics
        course.setTotalStudents(course.getTotalStudents() + 1);
        courseRepository.save(course);

        // Create notification
        createNotification(userId, "COURSE_ENROLLED",
                "Enrolled in course: " + course.getTitle(),
                "You have successfully enrolled in " + course.getTitle(),
                courseId, null);

        return convertToEnrollmentDto(enrollment);
    }

    /**
     * Get employee's enrolled courses
     */
    public Page<CourseDto> getEnrolledCourses(Integer userId, Pageable pageable) {
        return enrollmentRepository.findByUserId(userId, pageable)
                .map(enrollment -> convertToCourseDto(enrollment.getCourse(), userId));
    }

    /**
     * Get enrollment details
     */
    public EnrollmentDto getEnrollmentDetails(Integer enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        return convertToEnrollmentDto(enrollment);
    }

    /**
     * Get enrollment by user and course
     */
    public EnrollmentDto getEnrollment(Integer userId, Integer courseId) {
        CourseEnrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        return convertToEnrollmentDto(enrollment);
    }

    /**
     * Update enrollment progress
     */
    @Transactional
    public EnrollmentDto updateEnrollmentProgress(Integer enrollmentId, Integer progressPercentage) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setProgressPercentage(Math.min(progressPercentage, 100));

        if (progressPercentage > 0) {
            enrollment.setStatus("IN_PROGRESS");
            enrollment.setStartDate(enrollment.getStartDate() != null ? enrollment.getStartDate() : LocalDateTime.now());
        }

        if (progressPercentage >= 100) {
            enrollment.setStatus("COMPLETED");
            enrollment.setCompletionDate(LocalDateTime.now());
            enrollment.setProgressPercentage(100);

            // Update course metrics
            TrainingCourse course = enrollment.getCourse();
            course.setTotalCompleted(course.getTotalCompleted() + 1);
            courseRepository.save(course);

            // Create notification
            createNotification(enrollment.getUser().getId(), "COURSE_COMPLETED",
                    "Course completed: " + course.getTitle(),
                    "Congratulations! You have completed " + course.getTitle(),
                    enrollment.getCourse().getId(), null);
        }

        enrollment = enrollmentRepository.save(enrollment);
        return convertToEnrollmentDto(enrollment);
    }

    /**
     * Drop course
     */
    @Transactional
    public void dropCourse(Integer enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getStatus().equals("DROPPED")) {
            enrollment.setStatus("DROPPED");
            enrollmentRepository.save(enrollment);

            // Update course metrics
            TrainingCourse course = enrollment.getCourse();
            course.setTotalStudents(Math.max(0, course.getTotalStudents() - 1));
            courseRepository.save(course);
        }
    }

    // ==================== LESSON TRACKING ====================

    /**
     * Mark lesson as started/completed
     */
    @Transactional
    public void completeLessonProgress(Integer lessonId, Integer userId, Integer enrollmentId, Integer timeSpent) {
        CourseLesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        LessonCompletion completion = lessonCompletionRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> LessonCompletion.builder()
                        .lesson(lesson)
                        .user(userRepository.findById(userId).orElseThrow())
                        .enrollment(enrollment)
                        .build());

        completion.setStatus("COMPLETED");
        completion.setTimeSpentMinutes(timeSpent);
        completion.setCompletionDate(LocalDateTime.now());
        lessonCompletionRepository.save(completion);

        // Update enrollment progress
        updateEnrollmentProgressByLessons(enrollmentId);

        // Create notification
        createNotification(userId, "LESSON_COMPLETED",
                "Lesson completed: " + lesson.getTitle(),
                "You have completed the lesson: " + lesson.getTitle(),
                enrollment.getCourse().getId(), null);
    }

    /**
     * Get lesson completion status
     */
    public CourseLessonDto.LessonItemDto getLessonStatus(Integer lessonId, Integer userId) {
        CourseLesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonCompletion completion = lessonCompletionRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElse(null);

        return CourseLessonDto.LessonItemDto.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .lessonOrder(lesson.getLessonOrder())
                .contentType(lesson.getContentType())
                .contentUrl(lesson.getContentUrl())
                .durationMinutes(lesson.getDurationMinutes())
                .description(lesson.getDescription())
                .isActive(lesson.getIsActive())
                .createdAt(lesson.getCreatedAt())
                .isCompleted(completion != null && completion.getStatus().equals("COMPLETED"))
                .timeSpentMinutes(completion != null ? completion.getTimeSpentMinutes() : 0)
                .build();
    }

    // ==================== RATING MANAGEMENT ====================

    /**
     * Rate a course
     */
    @Transactional
    public void rateCourse(Integer courseId, Integer userId, Integer rating, String comment) {
        TrainingCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify user is enrolled
        enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("User is not enrolled in this course"));

        CourseRating courseRating = ratingRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> CourseRating.builder()
                        .course(course)
                        .user(user)
                        .build());

        courseRating.setRating(rating);
        courseRating.setComment(comment);
        ratingRepository.save(courseRating);

        // Update course average rating
        updateCourseRating(courseId);
    }

    /**
     * Get course ratings
     */
    public List<CourseRating> getCourseRatings(Integer courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

    // ==================== ASSIGNMENT MANAGEMENT ====================

    /**
     * Get pending assignments for employee
     */
    public Page<TrainingAssignment> getPendingAssignments(Integer userId, Pageable pageable) {
        return assignmentRepository.findByUserIdAndStatus(userId, "PENDING", pageable).stream()
                .collect(Collectors.toCollection(() -> new java.util.ArrayList<TrainingAssignment>()))
                .isEmpty() ? Page.empty() : Page.empty();
    }

    /**
     * Get all assignments for employee
     */
    public Page<TrainingAssignment> getAssignments(Integer userId, Pageable pageable) {
        return assignmentRepository.findByUserId(userId, pageable);
    }

    // ==================== NOTIFICATIONS ====================

    /**
     * Get user notifications
     */
    public Page<TrainingNotification> getNotifications(Integer userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }

    /**
     * Get unread notifications count
     */
    public long getUnreadNotificationCount(Integer userId) {
        return notificationRepository.countUnreadNotifications(userId);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markNotificationAsRead(Integer notificationId) {
        TrainingNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    // ==================== DASHBOARD STATISTICS ====================

    /**
     * Get employee learning statistics
     */
    public DashboardStats getEmployeeDashboardStats(Integer userId) {
        List<CourseEnrollment> enrollments = enrollmentRepository.findActiveEnrollments(userId);
        long pendingAssignments = assignmentRepository.countPendingAssignments(userId);
        long unreadNotifications = notificationRepository.countUnreadNotifications(userId);

        int totalCourses = enrollments.size();
        int completedCourses = (int) enrollments.stream()
                .filter(e -> e.getStatus().equals("COMPLETED"))
                .count();

        return DashboardStats.builder()
                .totalEnrolledCourses(totalCourses)
                .completedCourses(completedCourses)
                .inProgressCourses(totalCourses - completedCourses)
                .pendingAssignments(pendingAssignments)
                .unreadNotifications(unreadNotifications)
                .build();
    }

    // ==================== HELPER METHODS ====================

    private CourseDto convertToCourseDto(TrainingCourse course, Integer userId) {
        CourseEnrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, course.getId()).orElse(null);

        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .code(course.getCode())
                .description(course.getDescription())
                .categoryId(course.getCategory().getId())
                .categoryName(course.getCategory().getName())
                .trainerId(course.getTrainer() != null ? course.getTrainer().getId() : null)
                .trainerName(course.getTrainer() != null ? course.getTrainer().getFullName() : null)
                .thumbnailUrl(course.getThumbnailUrl())
                .durationHours(course.getDurationHours())
                .level(course.getLevel())
                .status(course.getStatus())
                .startDate(course.getStartDate())
                .endDate(course.getEndDate())
                .maxParticipants(course.getMaxParticipants())
                .totalStudents(course.getTotalStudents())
                .totalCompleted(course.getTotalCompleted())
                .averageRating(course.getAverageRating())
                .ratingCount(course.getRatingCount())
                .isRequired(course.getIsRequired())
                .isActive(course.getIsActive())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .enrollmentStatus(getEnrollmentStatus(enrollment))
                .build();
    }

    private CourseLessonDto convertToChapterDto(CourseChapter chapter, Integer userId) {
        List<CourseLesson> lessons = lessonRepository.findByChapterIdOrderByLessonOrder(chapter.getId());

        List<CourseLessonDto.LessonItemDto> lessonDtos = lessons.stream()
                .map(lesson -> {
                    LessonCompletion completion = lessonCompletionRepository.findByUserIdAndLessonId(userId, lesson.getId()).orElse(null);
                    return CourseLessonDto.LessonItemDto.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .lessonOrder(lesson.getLessonOrder())
                            .contentType(lesson.getContentType())
                            .contentUrl(lesson.getContentUrl())
                            .durationMinutes(lesson.getDurationMinutes())
                            .description(lesson.getDescription())
                            .isActive(lesson.getIsActive())
                            .createdAt(lesson.getCreatedAt())
                            .isCompleted(completion != null && completion.getStatus().equals("COMPLETED"))
                            .timeSpentMinutes(completion != null ? completion.getTimeSpentMinutes() : 0)
                            .build();
                })
                .collect(Collectors.toList());

        return CourseLessonDto.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterOrder(chapter.getChapterOrder())
                .description(chapter.getDescription())
                .durationMinutes(chapter.getDurationMinutes())
                .isActive(chapter.getIsActive())
                .createdAt(chapter.getCreatedAt())
                .lessons(lessonDtos)
                .build();
    }

    private EnrollmentDto convertToEnrollmentDto(CourseEnrollment enrollment) {
        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .courseThumbnail(enrollment.getCourse().getThumbnailUrl())
                .userId(enrollment.getUser().getId())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .startDate(enrollment.getStartDate())
                .completionDate(enrollment.getCompletionDate())
                .status(enrollment.getStatus())
                .progressPercentage(enrollment.getProgressPercentage())
                .certificateUrl(enrollment.getCertificateUrl())
                .completionNotes(enrollment.getCompletionNotes())
                .createdAt(enrollment.getCreatedAt())
                .updatedAt(enrollment.getUpdatedAt())
                .build();
    }

    private Integer getEnrollmentStatus(CourseEnrollment enrollment) {
        if (enrollment == null) return 0; // Not enrolled
        return switch (enrollment.getStatus()) {
            case "ENROLLED" -> 1;
            case "IN_PROGRESS" -> 2;
            case "COMPLETED" -> 3;
            default -> 0;
        };
    }

    private void updateCourseRating(Integer courseId) {
        TrainingCourse course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Double averageRating = ratingRepository.calculateAverageRating(courseId);
        int ratingCount = ratingRepository.findByCourseId(courseId).size();

        course.setAverageRating(averageRating != null ? averageRating.floatValue() : null);
        course.setRatingCount(ratingCount);
        courseRepository.save(course);
    }

    private void updateEnrollmentProgressByLessons(Integer enrollmentId) {
        CourseEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        int courseId = enrollment.getCourse().getId();
        List<CourseLesson> allLessons = lessonRepository.findByCourseIdOrderByLessonOrder(courseId);

        if (allLessons.isEmpty()) {
            return;
        }

        long completedLessons = lessonCompletionRepository.countCompletedLessons(enrollmentId);
        int progress = (int) ((completedLessons * 100) / allLessons.size());

        updateEnrollmentProgress(enrollmentId, progress);
    }

    private void createNotification(Integer userId, String type, String title, String message, Integer courseId, Integer assignmentId) {
        User user = userRepository.findById(userId).orElse(null);
        TrainingCourse course = courseId != null ? courseRepository.findById(courseId).orElse(null) : null;

        TrainingNotification notification = TrainingNotification.builder()
                .user(user)
                .notificationType(type)
                .title(title)
                .message(message)
                .relatedCourse(course)
                .relatedAssignmentId(assignmentId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    // ==================== INNER CLASS FOR DASHBOARD STATS ====================

    public static class DashboardStats {
        public int totalEnrolledCourses;
        public int completedCourses;
        public int inProgressCourses;
        public long pendingAssignments;
        public long unreadNotifications;

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private int totalEnrolledCourses;
            private int completedCourses;
            private int inProgressCourses;
            private long pendingAssignments;
            private long unreadNotifications;

            public Builder totalEnrolledCourses(int totalEnrolledCourses) {
                this.totalEnrolledCourses = totalEnrolledCourses;
                return this;
            }

            public Builder completedCourses(int completedCourses) {
                this.completedCourses = completedCourses;
                return this;
            }

            public Builder inProgressCourses(int inProgressCourses) {
                this.inProgressCourses = inProgressCourses;
                return this;
            }

            public Builder pendingAssignments(long pendingAssignments) {
                this.pendingAssignments = pendingAssignments;
                return this;
            }

            public Builder unreadNotifications(long unreadNotifications) {
                this.unreadNotifications = unreadNotifications;
                return this;
            }

            public DashboardStats build() {
                DashboardStats stats = new DashboardStats();
                stats.totalEnrolledCourses = this.totalEnrolledCourses;
                stats.completedCourses = this.completedCourses;
                stats.inProgressCourses = this.inProgressCourses;
                stats.pendingAssignments = this.pendingAssignments;
                stats.unreadNotifications = this.unreadNotifications;
                return stats;
            }
        }
    }
}
