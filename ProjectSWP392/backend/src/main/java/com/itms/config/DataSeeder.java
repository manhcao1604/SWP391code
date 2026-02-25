package com.itms.config;

import com.itms.entity.*;
import com.itms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData(
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            TrainingCourseRepository trainingCourseRepository,
            LearningSessionRepository learningSessionRepository,
            EmployeeEnrollmentRepository employeeEnrollmentRepository,
            CourseFeedbackRepository courseFeedbackRepository,
            EmployeeNotificationRepository employeeNotificationRepository,
            CertificateRepository certificateRepository
    ) {
        return args -> {
            Role adminRole = createRole(roleRepository, "Administrator", "ADMIN", "Full system access");
            Role hrRole = createRole(roleRepository, "Human Resources", "HR", "Manage training programs");
            Role trainerRole = createRole(roleRepository, "Trainer", "TRAINER", "Conduct training sessions");
            Role employeeRole = createRole(roleRepository, "Employee", "EMPLOYEE", "Access training courses");

            Department it = createDepartment(departmentRepository, "IT Department", "IT", "Information Technology Department");
            Department hr = createDepartment(departmentRepository, "HR Department", "HR", "Human Resources Department");
            Department finance = createDepartment(departmentRepository, "Finance Department", "FIN", "Finance and Accounting Department");

            String password = passwordEncoder.encode("admin123");
            User admin = createUser(userRepository, "admin", "admin@itms.com", "System Administrator", "0905123456", it, password);
            User hrUser = createUser(userRepository, "hr001", "hr@itms.com", "Nguyễn Văn HR", "0905123457", hr, password);
            User trainer = createUser(userRepository, "trainer001", "trainer@itms.com", "Trần Thị Trainer", "0905123458", it, password);
            User emp1 = createUser(userRepository, "emp001", "employee@itms.com", "Lê Văn Employee", "0905123459", finance, password);

            assignRole(userRoleRepository, admin, adminRole, admin);
            assignRole(userRoleRepository, hrUser, hrRole, admin);
            assignRole(userRoleRepository, trainer, trainerRole, admin);
            assignRole(userRoleRepository, emp1, employeeRole, admin);

            TrainingCourse python = createCourse(trainingCourseRepository, "PY001", "Lập trình Python cơ bản", "Lập trình", "BEGINNER", 80d);
            TrainingCourse sql = createCourse(trainingCourseRepository, "DB001", "Cơ sở dữ liệu SQL", "Data", "BEGINNER", 75d);

            LearningSession pythonS1 = createSession(learningSessionRepository, python, "Python Variables & Functions", LocalDate.now().plusDays(2), 9, 0, 11, 0, "https://meet.company.local/python-1");
            LearningSession sqlS1 = createSession(learningSessionRepository, sql, "SQL Join và Subquery", LocalDate.now().plusDays(3), 14, 0, 16, 0, "https://meet.company.local/sql-1");

            EmployeeEnrollment ePython = createEnrollment(employeeEnrollmentRepository, emp1, pythonS1, "APPROVED", 68d, 72d, false);
            EmployeeEnrollment eSql = createEnrollment(employeeEnrollmentRepository, emp1, sqlS1, "COMPLETED", 100d, 90d, true);

            createCertificate(certificateRepository, eSql, "CERT-SQL-EMP001", "https://cert.company.local/CERT-SQL-EMP001");
            createFeedback(courseFeedbackRepository, eSql, sqlS1, emp1, 5, "Khóa học SQL thực tế và dễ áp dụng.", "Tăng thêm bài thực hành nâng cao");
            createNotification(employeeNotificationRepository, emp1, "REMINDER", "Lịch học Python", "Bạn có buổi học Python vào 09:00 ngày mai.");
            createNotification(employeeNotificationRepository, emp1, "CERTIFICATE", "Đã cấp chứng chỉ", "Bạn đã được cấp chứng chỉ khóa Cơ sở dữ liệu SQL.");

            System.out.println("✅ ITMS seed data completed successfully");
        };
    }

    private Role createRole(RoleRepository repo, String name, String code, String desc) {
        return repo.findByRoleCode(code).orElseGet(() ->
                repo.save(Role.builder().roleName(name).roleCode(code).description(desc).isActive(true).createdAt(LocalDateTime.now()).build()));
    }

    private Department createDepartment(DepartmentRepository repo, String name, String code, String desc) {
        return repo.findByName(name).orElseGet(() ->
                repo.save(Department.builder().name(name).code(code).description(desc).isActive(true).createdAt(LocalDateTime.now()).build()));
    }

    private User createUser(UserRepository repo, String username, String email, String fullName, String phone, Department dept, String password) {
        return repo.findByUsername(username).orElseGet(() ->
                repo.save(User.builder().username(username).email(email).fullName(fullName).phone(phone).department(dept).password(password).isActive(true).otpEnabled(false).createdAt(LocalDateTime.now()).build()));
    }

    private void assignRole(UserRoleRepository repo, User user, Role role, User assignedBy) {
        if (!repo.existsByUserAndRole(user, role)) {
            repo.save(UserRole.builder().user(user).role(role).assignedBy(assignedBy).isActive(true).build());
        }
    }

    private TrainingCourse createCourse(TrainingCourseRepository repo, String code, String title, String category, String level, Double passingScore) {
        return repo.findByCode(code).orElseGet(() -> repo.save(TrainingCourse.builder()
                .code(code)
                .title(title)
                .description("Khóa học dành cho nhân viên mới")
                .category(category)
                .level(level)
                .status("ACTIVE")
                .passingScore(passingScore)
                .durationHours(24d)
                .build()));
    }

    private LearningSession createSession(LearningSessionRepository repo, TrainingCourse course, String topic, LocalDate date, int startHour, int startMinute, int endHour, int endMinute, String meetingUrl) {
        return repo.findByCourseIdOrderBySessionDateAscStartTimeAsc(course.getId()).stream()
                .filter(s -> s.getTopic().equalsIgnoreCase(topic) && s.getSessionDate().equals(date))
                .findFirst()
                .orElseGet(() -> repo.save(LearningSession.builder()
                        .course(course)
                        .topic(topic)
                        .sessionDate(date)
                        .startTime(java.time.LocalTime.of(startHour, startMinute))
                        .endTime(java.time.LocalTime.of(endHour, endMinute))
                        .meetingUrl(meetingUrl)
                        .status("SCHEDULED")
                        .build()));
    }

    private EmployeeEnrollment createEnrollment(EmployeeEnrollmentRepository repo, User employee, LearningSession session, String status, Double completionRate, Double finalScore, Boolean certIssued) {
        return repo.findByEmployeeIdAndSessionId(employee.getId(), session.getId())
                .orElseGet(() -> repo.save(EmployeeEnrollment.builder()
                        .employee(employee)
                        .session(session)
                        .status(status)
                        .completionRate(completionRate)
                        .finalScore(finalScore)
                        .certificateIssued(certIssued)
                        .registeredAt(LocalDateTime.now().minusDays(10))
                        .completionDate("COMPLETED".equals(status) ? LocalDateTime.now().minusDays(1) : null)
                        .build()));
    }

    private void createFeedback(CourseFeedbackRepository repo, EmployeeEnrollment enrollment, LearningSession session, User user, int rating, String comment, String suggestions) {
        CourseFeedback feedback = repo.findByEnrollmentIdAndSessionId(enrollment.getId(), session.getId())
                .orElseGet(CourseFeedback::new);
        feedback.setEnrollment(enrollment);
        feedback.setSession(session);
        feedback.setUser(user);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setSuggestions(suggestions);
        feedback.setCreatedAt(LocalDateTime.now().minusDays(1));
        repo.save(feedback);
    }

    private void createNotification(EmployeeNotificationRepository repo, User employee, String type, String title, String message) {
        boolean exists = repo.findByEmployeeIdOrderByCreatedAtDesc(employee.getId()).stream()
                .anyMatch(n -> n.getTitle().equals(title) && n.getMessage().equals(message));
        if (!exists) {
            repo.save(EmployeeNotification.builder()
                    .employee(employee)
                    .type(type)
                    .title(title)
                    .message(message)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }

    private void createCertificate(CertificateRepository repo, EmployeeEnrollment enrollment, String code, String url) {
        boolean exists = repo.findByEnrollmentEmployeeIdAndIsValidTrue(enrollment.getEmployee().getId())
                .stream()
                .anyMatch(c -> c.getEnrollment().getId().equals(enrollment.getId()));
        if (!exists) {
            repo.save(Certificate.builder()
                    .enrollment(enrollment)
                    .certificateCode(code)
                    .certificateUrl(url)
                    .issueDate(LocalDate.now().minusDays(1))
                    .isValid(true)
                    .build());
        }
    }
}
