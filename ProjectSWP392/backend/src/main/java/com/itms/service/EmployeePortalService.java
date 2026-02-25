package com.itms.service;

import com.itms.dto.employee.CreateFeedbackRequest;
import com.itms.dto.employee.EmployeePortalDto;
import com.itms.entity.*;
import com.itms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmployeePortalService {
    private final EmployeeEnrollmentRepository enrollmentRepository;
    private final LearningSessionRepository sessionRepository;
    private final CourseFeedbackRepository feedbackRepository;
    private final EmployeeNotificationRepository notificationRepository;
    private final CertificateRepository certificateRepository;

    @Transactional(readOnly = true)
    public EmployeePortalDto getPortalData(Integer employeeId) {
        List<EmployeeEnrollment> enrollments = enrollmentRepository.findByEmployeeIdOrderByRegisteredAtDesc(employeeId);
        List<CourseFeedback> feedbacks = feedbackRepository.findByUserIdOrderByCreatedAtDesc(employeeId);
        List<EmployeeNotification> notifications = notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
        List<Certificate> certificates = certificateRepository.findByEnrollmentEmployeeIdAndIsValidTrue(employeeId);

        Map<Integer, EmployeeEnrollment> latestCourseEnrollment = new LinkedHashMap<>();
        for (EmployeeEnrollment e : enrollments) {
            latestCourseEnrollment.putIfAbsent(e.getSession().getCourse().getId(), e);
        }

        List<Integer> courseIds = latestCourseEnrollment.keySet().stream().toList();
        List<LearningSession> sessions = courseIds.isEmpty()
                ? List.of()
                : sessionRepository.findByCourseIdInOrderBySessionDateAscStartTimeAsc(courseIds);

        int activeCourses = (int) latestCourseEnrollment.values().stream()
                .filter(e -> Set.of("REGISTERED", "APPROVED", "WAITLIST").contains(e.getStatus()))
                .count();
        int completedCourses = (int) latestCourseEnrollment.values().stream()
                .filter(e -> "COMPLETED".equalsIgnoreCase(e.getStatus()))
                .count();
        int avgProgress = latestCourseEnrollment.isEmpty()
                ? 0
                : (int) Math.round(latestCourseEnrollment.values().stream()
                .map(EmployeeEnrollment::getCompletionRate)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average().orElse(0));

        DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");

        return EmployeePortalDto.builder()
                .summary(EmployeePortalDto.Summary.builder()
                        .activeCourses(activeCourses)
                        .completedCourses(completedCourses)
                        .averageProgress(avgProgress)
                        .certificates(certificates.size())
                        .build())
                .courses(latestCourseEnrollment.values().stream().map(e -> EmployeePortalDto.CourseItem.builder()
                        .enrollmentId(e.getId())
                        .sessionId(e.getSession().getId())
                        .courseId(e.getSession().getCourse().getId())
                        .title(e.getSession().getCourse().getTitle())
                        .category(e.getSession().getCourse().getCategory())
                        .progressPercent((int) Math.round(Optional.ofNullable(e.getCompletionRate()).orElse(0d)))
                        .completionStatus(e.getStatus())
                        .build()).toList())
                .schedule(sessions.stream()
                        .filter(s -> !s.getSessionDate().isBefore(java.time.LocalDate.now()))
                        .limit(20)
                        .map(s -> EmployeePortalDto.ScheduleItem.builder()
                                .enrollmentId(latestCourseEnrollment.get(s.getCourse().getId()).getId())
                                .courseTitle(s.getCourse().getTitle())
                                .topic(s.getTopic())
                                .sessionDate(s.getSessionDate().format(dateFmt))
                                .startTime(s.getStartTime().format(timeFmt))
                                .endTime(s.getEndTime().format(timeFmt))
                                .build()).toList())
                .results(latestCourseEnrollment.values().stream().map(e -> EmployeePortalDto.ResultItem.builder()
                        .enrollmentId(e.getId())
                        .title(e.getSession().getCourse().getTitle())
                        .finalScore(e.getFinalScore() == null ? null : (int) Math.round(e.getFinalScore()))
                        .completionStatus(e.getStatus())
                        .canDownloadCertificate(Boolean.TRUE.equals(e.getCertificateIssued()))
                        .build()).toList())
                .feedbacks(feedbacks.stream().map(f -> EmployeePortalDto.FeedbackItem.builder()
                        .id(f.getId())
                        .courseTitle(f.getSession().getCourse().getTitle())
                        .rating(Optional.ofNullable(f.getRating()).orElse(0))
                        .comment(f.getComment())
                        .createdAt(f.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                        .build()).toList())
                .notifications(notifications.stream().map(n -> EmployeePortalDto.NotificationItem.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .type(n.getType())
                        .read(Boolean.TRUE.equals(n.getIsRead()))
                        .createdAt(n.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                        .build()).toList())
                .build();
    }

    @Transactional
    public void createFeedback(Integer employeeId, CreateFeedbackRequest request) {
        EmployeeEnrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Bạn không có quyền phản hồi cho khóa học này");
        }

        if (!enrollment.getSession().getId().equals(request.getSessionId())) {
            throw new RuntimeException("Session không thuộc enrollment đã chọn");
        }

        CourseFeedback feedback = feedbackRepository.findByEnrollmentIdAndSessionId(request.getEnrollmentId(), request.getSessionId())
                .orElseGet(CourseFeedback::new);

        feedback.setEnrollment(enrollment);
        feedback.setSession(enrollment.getSession());
        feedback.setUser(enrollment.getEmployee());
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setSuggestions(request.getSuggestions());
        feedback.setCreatedAt(LocalDateTime.now());

        feedbackRepository.save(feedback);
    }

    @Transactional
    public void markNotificationRead(Integer employeeId, Integer notificationId) {
        EmployeeNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông báo này");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
    }
}
