# Employee Training Management Module - Complete Implementation Guide

## Overview

This comprehensive Employee Training Management System is designed for the internal company training program. It provides a professional-grade platform for managing training courses, employee enrollments, progress tracking, and learning analytics.

## Project Structure

### Database Layer (SQL Server)

```
ProjectSWP392/database/
├── 01-training-schema.sql        # Complete database schema
└── 02-training-seed-data.sql     # Sample data for testing
```

### Backend Layer (Java/Spring Boot)

```
ProjectSWP392/backend/src/main/java/com/itms/
├── entity/
│   ├── TrainingCategory.java                  # Training categories
│   ├── TrainingCourse.java                    # Courses
│   ├── CourseChapter.java                     # Course chapters/modules
│   ├── CourseLesson.java                      # Individual lessons
│   ├── CourseEnrollment.java                  # Employee enrollments
│   ├── LessonCompletion.java                  # Lesson tracking
│   ├── CourseRating.java                      # Course ratings
│   ├── TrainingAssignment.java                # Training assignments
│   └── TrainingNotification.java              # Training notifications
├── repository/
│   ├── TrainingCourseRepository.java
│   ├── CourseEnrollmentRepository.java
│   ├── CourseChapterRepository.java
│   ├── CourseLessonRepository.java
│   ├── TrainingCategoryRepository.java
│   ├── CourseRatingRepository.java
│   ├── LessonCompletionRepository.java
│   ├── TrainingAssignmentRepository.java
│   └── TrainingNotificationRepository.java
├── service/
│   └── EmployeeTrainingService.java           # Business logic
├── controller/
│   └── EmployeeTrainingController.java        # REST APIs
└── dto/training/
    ├── CourseDto.java
    ├── CourseLessonDto.java
    └── EnrollmentDto.java
```

### Frontend Layer (React/TypeScript)

```
ProjectSWP392/frontend/src/
└── pages/
    └── EmployeeTraining.tsx                   # Main training dashboard
```

## Database Schema

### Core Tables

1. **TrainingCategory**
   - Stores training course categories
   - Fields: id, name, code, description, icon_url, display_order, is_active

2. **TrainingCourse**
   - Main course information
   - Fields: id, title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, max_participants, start_date, end_date, enrollment_deadline, total_students, total_completed, average_rating, rating_count, is_required, is_active

3. **CourseChapter**
   - Course modules/chapters
   - Fields: id, course_id, title, chapter_order, description, duration_minutes, is_active

4. **CourseLesson**
   - Individual lessons within chapters
   - Fields: id, chapter_id, course_id, title, lesson_order, content_type (VIDEO, DOCUMENT, QUIZ, ASSIGNMENT, DISCUSSION), content_url, description, duration_minutes, is_active

5. **CourseEnrollment**
   - Employee course enrollments
   - Fields: id, course_id, user_id, enrollment_date, start_date, completion_date, status (ENROLLED, IN_PROGRESS, COMPLETED, DROPPED), progress_percentage, certificate_url

6. **LessonCompletion**
   - Tracks lesson completion progress
   - Fields: id, lesson_id, user_id, enrollment_id, completion_date, status (NOT_STARTED, IN_PROGRESS, COMPLETED), time_spent_minutes

7. **CourseRating**
   - Employee course ratings and reviews
   - Fields: id, course_id, user_id, rating (1-5), comment

8. **TrainingAssignment**
   - Training assignments for employees
   - Fields: id, course_id, user_id, assigned_date, assigned_by, deadline, priority, completion_date, completion_status, notes

9. **TrainingNotification**
   - Training-related notifications
   - Fields: id, user_id, notification_type, title, message, related_course_id, related_assignment_id, is_read, read_at

## Backend API Endpoints

### Categories
```
GET /api/v1/training/categories
- Get all active training categories
- Returns: List<TrainingCategory>
```

### Courses
```
GET /api/v1/training/courses?page=0&size=10
- Get all published courses with pagination
- Returns: Page<CourseDto>

GET /api/v1/training/courses/category/{categoryId}?page=0&size=10
- Get courses by category
- Returns: Page<CourseDto>

GET /api/v1/training/courses/{courseId}
- Get course details with chapters and lessons
- Returns: CourseDto with nested chapters and lessons

GET /api/v1/training/courses/required
- Get required courses for employee
- Returns: List<CourseDto>
```

### Enrollment
```
POST /api/v1/training/enroll/{courseId}
- Enroll employee in a course
- Returns: EnrollmentDto

GET /api/v1/training/enrollments?page=0&size=10
- Get employee's enrolled courses
- Returns: Page<CourseDto>

GET /api/v1/training/enrollments/{enrollmentId}
- Get enrollment details
- Returns: EnrollmentDto

GET /api/v1/training/enrollments/course/{courseId}
- Get enrollment for specific course
- Returns: EnrollmentDto

PUT /api/v1/training/enrollments/{enrollmentId}/progress?progressPercentage=65
- Update enrollment progress
- Returns: EnrollmentDto

DELETE /api/v1/training/enrollments/{enrollmentId}
- Drop course
- Returns: Success message
```

### Lesson Tracking
```
POST /api/v1/training/lessons/{lessonId}/complete?enrollmentId=1&timeSpent=30
- Mark lesson as completed
- Returns: Success message

GET /api/v1/training/lessons/{lessonId}/status
- Get lesson completion status
- Returns: LessonItemDto
```

### Ratings
```
POST /api/v1/training/courses/{courseId}/rate?rating=5&comment=Great course!
- Rate a course
- Returns: Success message

GET /api/v1/training/courses/{courseId}/ratings
- Get course ratings
- Returns: List<CourseRating>
```

### Assignments
```
GET /api/v1/training/assignments?page=0&size=10
- Get all assignments for employee
- Returns: Page<TrainingAssignment>
```

### Notifications
```
GET /api/v1/training/notifications?page=0&size=10
- Get user notifications
- Returns: Page<TrainingNotification>

GET /api/v1/training/notifications/unread/count
- Get unread notifications count
- Returns: Long

PUT /api/v1/training/notifications/{notificationId}/read
- Mark notification as read
- Returns: Success message
```

### Dashboard
```
GET /api/v1/training/dashboard/stats
- Get employee dashboard statistics
- Returns: DashboardStats (totalEnrolledCourses, completedCourses, inProgressCourses, pendingAssignments, unreadNotifications)
```

## Key Features

### 1. Course Management
- Browse published training courses
- Filter by category
- View detailed course information with chapters and lessons
- Track completion statistics

### 2. Employee Enrollment
- Self-enrollment in courses
- Track enrollment status (ENROLLED, IN_PROGRESS, COMPLETED, DROPPED)
- Automatic progress calculation based on lesson completion

### 3. Progress Tracking
- Real-time progress percentage calculation
- Lesson-by-lesson completion tracking
- Time spent tracking for each lesson
- Visual progress indicators

### 4. Course Ratings
- Rate completed courses (1-5 stars)
- Leave written reviews
- View course average ratings and rating counts
- Automatic rating aggregation

### 5. Assignment Management
- View assigned training tasks
- Track assignment status (PENDING, COMPLETED, OVERDUE)
- Priority levels (LOW, MEDIUM, HIGH, URGENT)

### 6. Notifications System
- Real-time notifications for:
  - Course enrollment
  - Lesson completion
  - Course completion
  - Assignment deadlines
- Mark notifications as read/unread
- Unread notification count

### 7. Dashboard Analytics
- Total enrolled courses
- Completed courses count
- In-progress courses count
- Pending assignments
- Unread notifications
- Progress visualization with charts

## Security & Access Control

All endpoints are protected with:
- Spring Security authentication
- JWT token validation
- Role-based access control
- User isolation (employees can only see their own data)

## Implementation Steps

### Step 1: Database Setup
1. Execute `/database/01-training-schema.sql` in SQL Server
2. Execute `/database/02-training-seed-data.sql` for sample data

### Step 2: Update Java Entities
The following entity classes have been created:
- TrainingCategory, TrainingCourse, CourseChapter, CourseLesson
- CourseEnrollment, LessonCompletion, CourseRating
- TrainingAssignment, TrainingNotification

Hibernate will automatically create/update tables based on these entities.

### Step 3: Add Repositories
All repository interfaces are prepared with custom query methods for:
- Finding courses by category
- Calculating completion percentages
- Retrieving user-specific data
- Aggregating ratings and statistics

### Step 4: Deploy Service Layer
The EmployeeTrainingService contains complete business logic for:
- Course browsing and filtering
- Enrollment management
- Progress tracking and updates
- Rating management
- Notification creation and management
- Dashboard statistics calculation

### Step 5: Expose REST APIs
EmployeeTrainingController provides all necessary REST endpoints with:
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Pagination support
- Authentication via Spring Security
- Comprehensive error handling

### Step 6: Frontend Integration
The React component provides:
- Beautiful dashboard with charts
- Course browsing and filtering
- Enrollment management UI
- Progress visualization
- Resource management interface

## Configuration

### Persistence Configuration
Ensure your `persistence.xml` includes all entities:

```java
<property name="jakarta.persistence.jdbc.driver" value="com.microsoft.sqlserver.jdbc.SQLServerDriver"/>
<property name="jakarta.persistence.jdbc.url" value="jdbc:sqlserver://YOUR_SERVER:1433;databaseName=ITMS;encrypt=true;trustServerCertificate=true"/>
<property name="jakarta.persistence.jdbc.user" value="YOUR_USER"/>
<property name="jakarta.persistence.jdbc.password" value="YOUR_PASSWORD"/>
<property name="hibernate.dialect" value="org.hibernate.dialect.SQLServerDialect"/>
<property name="jakarta.persistence.schema-generation.database.action" value="update"/>
```

### Spring Boot Configuration (application.properties/yml)
```properties
spring.datasource.url=jdbc:sqlserver://YOUR_SERVER:1433;databaseName=ITMS
spring.datasource.username=YOUR_USER
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
```

## Testing the Module

### Using Postman or cURL:

1. **Get Categories**
```bash
GET /api/v1/training/categories
Authorization: Bearer YOUR_JWT_TOKEN
```

2. **Get Published Courses**
```bash
GET /api/v1/training/courses?page=0&size=10
Authorization: Bearer YOUR_JWT_TOKEN
```

3. **Enroll in Course**
```bash
POST /api/v1/training/enroll/1
Authorization: Bearer YOUR_JWT_TOKEN
```

4. **Get Dashboard Stats**
```bash
GET /api/v1/training/dashboard/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

## Performance Optimization

### Database Indices
The following columns have indices for optimal query performance:
- CourseChapter: course_id
- CourseLesson: chapter_id, course_id
- CourseEnrollment: user_id, course_id, status
- LessonCompletion: user_id, lesson_id, enrollment_id
- CourseRating: course_id, user_id
- TrainingAssignment: user_id, course_id, status
- TrainingNotification: user_id, is_read

### Lazy Loading
All entity relationships use LAZY loading to prevent N+1 query problems.

### Pagination
All list endpoints support pagination to handle large datasets efficiently.

## Future Enhancements

1. **Advanced Analytics**
   - Department-level learning metrics
   - Learning path recommendations
   - Skills gap analysis

2. **Gamification**
   - Achievement badges
   - Leaderboards
   - Points system

3. **Social Learning**
   - Discussion forums
   - Peer-to-peer learning
   - Study groups

4. **AI-powered Features**
   - Personalized course recommendations
   - Learning path optimization
   - Automated assessment

5. **Mobile App**
   - Native mobile applications
   - Offline learning support
   - Mobile-friendly content delivery

6. **Integration**
   - Integration with HR systems
   - Automatic license/certification tracking
   - Performance review integration

## Support & Maintenance

### Common Issues

**Issue**: Courses not showing
- **Solution**: Ensure courses have status='PUBLISHED' and is_active=1

**Issue**: Progress not updating
- **Solution**: Check LessonCompletion records are being created with status='COMPLETED'

**Issue**: Enrollment fails
- **Solution**: Verify max_participants limit not reached and user not already enrolled

### Database Maintenance
- Regular backup of training data
- Archive completed enrollments periodically
- Monitor notification table size

## Conclusion

This comprehensive Employee Training Management System provides a professional, scalable solution for internal company training programs. All components are fully implemented, documented, and ready for deployment.

For questions or modifications, refer to the specific entity, service, and controller classes for detailed implementations.
