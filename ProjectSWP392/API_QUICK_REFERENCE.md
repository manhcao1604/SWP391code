# Employee Training API - Quick Reference Guide

## Base URL
```
http://localhost:8080/api/v1/training
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Training Categories

### Get All Categories
```
GET /categories

Response:
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Kỹ năng Lập trình",
      "code": "PROGRAMMING",
      "description": "...",
      "iconUrl": "...",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

---

## Training Courses

### Get All Published Courses (Paginated)
```
GET /courses?page=0&size=10

Response:
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Lập trình Java Cơ bản",
        "code": "JAVA_101",
        "description": "...",
        "categoryId": 1,
        "categoryName": "Kỹ năng Lập trình",
        "durationHours": 40,
        "level": "BEGINNER",
        "status": "PUBLISHED",
        "totalStudents": 45,
        "totalCompleted": 28,
        "averageRating": 4.5,
        "ratingCount": 42,
        "isRequired": true,
        "enrollmentStatus": 0
      }
    ],
    "totalElements": 15,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### Get Courses by Category
```
GET /courses/category/{categoryId}?page=0&size=10

Path Parameters:
- categoryId: Integer (required)

Query Parameters:
- page: Integer (default: 0)
- size: Integer (default: 10)

Response: Same as Get All Published Courses
```

### Get Course Details
```
GET /courses/{courseId}

Path Parameters:
- courseId: Integer (required)

Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Lập trình Java Cơ bản",
    "code": "JAVA_101",
    "description": "...",
    "chapters": [
      {
        "id": 1,
        "title": "Java Cơ bản và Thiết lập Môi trường",
        "chapterOrder": 1,
        "durationMinutes": 180,
        "lessons": [
          {
            "id": 1,
            "title": "Giới thiệu Java",
            "lessonOrder": 1,
            "contentType": "VIDEO",
            "contentUrl": "https://...",
            "durationMinutes": 45,
            "isCompleted": false,
            "timeSpentMinutes": 0
          }
        ]
      }
    ]
  }
}
```

### Get Required Courses
```
GET /courses/required

Response: List of CourseDto with isRequired=true
```

---

## Course Enrollment

### Enroll in Course
```
POST /enroll/{courseId}

Path Parameters:
- courseId: Integer (required)

Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "courseId": 1,
    "courseTitle": "Lập trình Java Cơ bản",
    "status": "ENROLLED",
    "progressPercentage": 0,
    "enrollmentDate": "2024-01-20T10:00:00"
  }
}
```

### Get Enrolled Courses
```
GET /enrollments?page=0&size=10

Query Parameters:
- page: Integer (default: 0)
- size: Integer (default: 10)

Response: Page<CourseDto>
```

### Get Enrollment Details
```
GET /enrollments/{enrollmentId}

Path Parameters:
- enrollmentId: Integer (required)

Response: EnrollmentDto
```

### Get Enrollment for Specific Course
```
GET /enrollments/course/{courseId}

Path Parameters:
- courseId: Integer (required)

Response: EnrollmentDto
```

### Update Progress
```
PUT /enrollments/{enrollmentId}/progress?progressPercentage=65

Path Parameters:
- enrollmentId: Integer (required)

Query Parameters:
- progressPercentage: Integer (required) - 0 to 100

Response: Updated EnrollmentDto
```

### Drop Course
```
DELETE /enrollments/{enrollmentId}

Path Parameters:
- enrollmentId: Integer (required)

Response:
{
  "status": "success",
  "message": "Course dropped successfully"
}
```

---

## Lesson Tracking

### Mark Lesson as Completed
```
POST /lessons/{lessonId}/complete?enrollmentId=1&timeSpent=30

Path Parameters:
- lessonId: Integer (required)

Query Parameters:
- enrollmentId: Integer (required)
- timeSpent: Integer (optional) - minutes spent on lesson

Response:
{
  "status": "success",
  "message": "Lesson marked as completed"
}
```

### Get Lesson Status
```
GET /lessons/{lessonId}/status

Path Parameters:
- lessonId: Integer (required)

Response:
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Giới thiệu Java",
    "contentType": "VIDEO",
    "durationMinutes": 45,
    "isCompleted": true,
    "timeSpentMinutes": 45
  }
}
```

---

## Course Ratings

### Rate a Course
```
POST /courses/{courseId}/rate?rating=5&comment=Great course!

Path Parameters:
- courseId: Integer (required)

Query Parameters:
- rating: Integer (required) - 1 to 5
- comment: String (optional)

Response:
{
  "status": "success",
  "message": "Course rated successfully"
}
```

### Get Course Ratings
```
GET /courses/{courseId}/ratings

Path Parameters:
- courseId: Integer (required)

Response:
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "userId": 2,
      "rating": 5,
      "comment": "Great course!",
      "createdAt": "2024-01-20T10:00:00"
    }
  ]
}
```

---

## Assignments

### Get All Assignments
```
GET /assignments?page=0&size=10

Query Parameters:
- page: Integer (default: 0)
- size: Integer (default: 10)

Response:
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "courseId": 1,
        "userId": 2,
        "deadline": "2024-02-01T23:59:59",
        "priority": "HIGH",
        "completionStatus": "PENDING"
      }
    ],
    "totalElements": 4,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

---

## Notifications

### Get Notifications
```
GET /notifications?page=0&size=10

Query Parameters:
- page: Integer (default: 0)
- size: Integer (default: 10)

Response:
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "notificationType": "COURSE_ENROLLED",
        "title": "Enrolled in course",
        "message": "You have successfully enrolled in Lập trình Java Cơ bản",
        "isRead": false,
        "createdAt": "2024-01-20T10:00:00"
      }
    ],
    "totalElements": 2,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

### Get Unread Notification Count
```
GET /notifications/unread/count

Response:
{
  "status": "success",
  "data": 2
}
```

### Mark Notification as Read
```
PUT /notifications/{notificationId}/read

Path Parameters:
- notificationId: Integer (required)

Response:
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

## Dashboard

### Get Dashboard Statistics
```
GET /dashboard/stats

Response:
{
  "status": "success",
  "data": {
    "totalEnrolledCourses": 8,
    "completedCourses": 3,
    "inProgressCourses": 5,
    "pendingAssignments": 4,
    "unreadNotifications": 2
  }
}
```

---

## Response Format

All responses follow this format:

### Success Response
```json
{
  "status": "success",
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2024-01-20T10:00:00"
}
```

---

## Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User does not have permission
- `404 Not Found` - Resource not found
- `409 Conflict` - User already enrolled in course
- `500 Internal Server Error` - Server error

---

## Pagination

All paginated endpoints support:
- `page`: 0-indexed page number (default: 0)
- `size`: Number of items per page (default: 10)

Response includes:
- `content`: Array of items
- `totalElements`: Total count of items
- `totalPages`: Total number of pages
- `currentPage`: Current page number
- `pageSize`: Items per page

---

## Example Usage (JavaScript/Fetch)

### Get All Courses
```javascript
const token = "YOUR_JWT_TOKEN";

fetch('/api/v1/training/courses?page=0&size=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Enroll in Course
```javascript
const courseId = 1;

fetch(`/api/v1/training/enroll/${courseId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Complete Lesson
```javascript
const lessonId = 5;
const enrollmentId = 1;
const timeSpent = 45;

fetch(`/api/v1/training/lessons/${lessonId}/complete?enrollmentId=${enrollmentId}&timeSpent=${timeSpent}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## Notification Types

- `COURSE_ENROLLED` - User enrolled in a course
- `COURSE_STARTED` - Course started date reached
- `LESSON_COMPLETED` - Lesson was completed
- `COURSE_COMPLETED` - Course completed
- `ASSIGNMENT_DUE` - Assignment deadline approaching

---

## Course Levels

- `BEGINNER` - Beginner level course
- `INTERMEDIATE` - Intermediate level course
- `ADVANCED` - Advanced level course
- `EXPERT` - Expert level course

---

## Course Status

- `DRAFT` - Course in development
- `PUBLISHED` - Course published and available
- `ARCHIVED` - Course archived (not available for enrollment)

---

## Lesson Content Types

- `VIDEO` - Video content
- `DOCUMENT` - Text document/PDF
- `QUIZ` - Quiz/assessment
- `ASSIGNMENT` - Assignment/project
- `DISCUSSION` - Discussion forum

---

## For More Information

Refer to the complete API documentation in the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

Or check the main implementation guide: `EMPLOYEE_TRAINING_MODULE.md`
