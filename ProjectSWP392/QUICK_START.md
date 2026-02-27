# Employee Training Module - Quick Start Guide

## 30-Minute Setup Guide

### Prerequisites
- Java 17 or higher
- SQL Server Management Studio
- Maven 3.8+
- Node.js 16+ (for frontend)
- Git

---

## Step 1: Database Setup (5 minutes)

### 1. Open SQL Server Management Studio
1. Open SSMS and connect to your SQL Server instance
2. Go to File → Open → File
3. Navigate to and open `database/01-training-schema.sql`
4. Click Execute (or press F5)
   - This creates the ITMS database and 9 tables

### 2. Add Sample Data
1. Open `database/02-training-seed-data.sql`
2. Execute the script
   - This adds 5 categories and 6 sample courses

**Verification:**
```sql
-- Run in SSMS to verify
USE ITMS;
SELECT COUNT(*) FROM TrainingCategory;      -- Should return 5
SELECT COUNT(*) FROM TrainingCourse;        -- Should return 6
SELECT COUNT(*) FROM CourseChapter;         -- Should return 5
SELECT COUNT(*) FROM CourseLesson;          -- Should return 4
```

---

## Step 2: Backend Configuration (5 minutes)

### 1. Update Database Connection
Edit `ProjectSWP392/backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://YOUR_SERVER:1433;databaseName=ITMS;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
spring.jpa.show-sql=false
```

### 2. Update Persistence.xml
Edit `ProjectSWP392/backend/src/main/resources/META-INF/persistence.xml`:

```xml
<property name="jakarta.persistence.jdbc.url" 
    value="jdbc:sqlserver://YOUR_SERVER:1433;databaseName=ITMS;encrypt=true;trustServerCertificate=true"/>
<property name="jakarta.persistence.jdbc.user" value="sa"/>
<property name="jakarta.persistence.jdbc.password" value="YOUR_PASSWORD"/>
```

### 3. Build Backend
```bash
cd ProjectSWP392/backend
mvn clean install
```

### 4. Start Backend Server
```bash
mvn spring-boot:run
```

**Expected Output:**
```
Started ItmsApplication in 5.234 seconds
Tomcat started on port(s): 8080
```

**Test:** Open http://localhost:8080/swagger-ui.html in your browser

---

## Step 3: Frontend Setup (5 minutes)

### 1. Install Dependencies
```bash
cd ProjectSWP392/frontend
npm install
```

### 2. Configure API Endpoint
Edit `src/services/api.ts` or where API calls are made:

```typescript
const API_BASE_URL = 'http://localhost:8080/api/v1/training';
```

### 3. Start Frontend
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in your browser
Local:          http://localhost:3000
```

---

## Step 4: Testing (15 minutes)

### Option 1: Test via Swagger UI

1. Open http://localhost:8080/swagger-ui.html
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Click "Execute"

### Option 2: Test via Postman

**Import Collection:**
1. Open Postman
2. Create new request
3. Set URL: `http://localhost:8080/api/v1/training/categories`
4. Add header: `Authorization: Bearer YOUR_JWT_TOKEN`
5. Click Send

### Option 3: Test via Frontend

1. Open http://localhost:3000
2. Click on courses tab
3. You should see 6 sample courses
4. Try enrolling in a course

### Option 4: Test via cURL

```bash
# Get all categories
curl -X GET "http://localhost:8080/api/v1/training/categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get published courses
curl -X GET "http://localhost:8080/api/v1/training/courses?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Key Testing Scenarios

### Scenario 1: Browse Courses
```
1. GET /api/v1/training/courses
   → Should return 6 sample courses
```

### Scenario 2: Enroll in Course
```
1. POST /api/v1/training/enroll/1
   → Should return enrollment details with status "ENROLLED"
   
2. GET /api/v1/training/enrollments
   → Should show the enrolled course
```

### Scenario 3: Update Progress
```
1. PUT /api/v1/training/enrollments/{enrollmentId}/progress?progressPercentage=50
   → Should update progress to 50%
   
2. PUT /api/v1/training/enrollments/{enrollmentId}/progress?progressPercentage=100
   → Should update status to "COMPLETED"
```

### Scenario 4: Complete Lesson
```
1. POST /api/v1/training/lessons/1/complete?enrollmentId=1&timeSpent=45
   → Should mark lesson as completed
   
2. GET /api/v1/training/lessons/1/status
   → Should show lesson as completed
```

### Scenario 5: Rate Course
```
1. POST /api/v1/training/courses/1/rate?rating=5&comment=Great course!
   → Should rate the course
   
2. GET /api/v1/training/courses/1/ratings
   → Should show the rating
```

### Scenario 6: Dashboard Stats
```
1. GET /api/v1/training/dashboard/stats
   → Should show:
      - totalEnrolledCourses
      - completedCourses
      - inProgressCourses
      - pendingAssignments
      - unreadNotifications
```

---

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
- Verify SQL Server is running
- Check username and password
- Ensure database name is "ITMS"
- Check firewall allows port 1433

### Issue: Port 8080 Already in Use
**Solution:**
```bash
# Change port in application.properties
server.port=8081

# Or kill process using port 8080
lsof -i :8080  # Find process
kill -9 <PID>  # Kill it
```

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Verify backend is running on http://localhost:8080
- Check CORS configuration in Spring Security
- Verify JWT token is valid
- Check browser console for errors

### Issue: Swagger UI Returns 404
**Solution:**
- Ensure backend is running
- Check URL: http://localhost:8080/swagger-ui.html (not /swagger-ui/)
- Verify Spring Boot started successfully

### Issue: No Sample Data Shows
**Solution:**
1. Check if 02-training-seed-data.sql was executed
2. Verify in SSMS:
   ```sql
   SELECT * FROM TrainingCourse
   ```
3. If empty, re-run the seed script

---

## API Response Examples

### Get All Categories
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Kỹ năng Lập trình",
      "code": "PROGRAMMING",
      "description": "Các khóa học về lập trình",
      "isActive": true
    }
  ]
}
```

### Get Published Courses
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Lập trình Java Cơ bản",
        "code": "JAVA_101",
        "durationHours": 40,
        "level": "BEGINNER",
        "totalStudents": 45,
        "totalCompleted": 28,
        "averageRating": 4.5,
        "isRequired": true,
        "enrollmentStatus": 0
      }
    ],
    "totalElements": 6,
    "totalPages": 1
  }
}
```

### Enroll in Course
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "courseId": 1,
    "courseTitle": "Lập trình Java Cơ bản",
    "status": "ENROLLED",
    "progressPercentage": 0,
    "enrollmentDate": "2024-01-20T10:00:00"
  },
  "message": "Successfully enrolled in course"
}
```

### Dashboard Stats
```json
{
  "status": "success",
  "data": {
    "totalEnrolledCourses": 1,
    "completedCourses": 0,
    "inProgressCourses": 1,
    "pendingAssignments": 0,
    "unreadNotifications": 0
  }
}
```

---

## Next Steps

1. **Customize Sample Data**
   - Edit `02-training-seed-data.sql` to add more courses
   - Re-run the script in SSMS

2. **Connect to Your User Database**
   - Replace user authentication with your existing users
   - Update USER_ID in enrollment calls

3. **Integrate with Frontend**
   - Replace mock API calls with real endpoints
   - Add authentication token handling
   - Implement error handling

4. **Deploy to Production**
   - Set up HTTPS
   - Configure database backups
   - Set up monitoring and logging
   - Optimize database indices

---

## File Locations

```
ProjectSWP392/
├── database/
│   ├── 01-training-schema.sql          ← Run first
│   └── 02-training-seed-data.sql       ← Run second
├── backend/
│   ├── pom.xml
│   ├── src/main/resources/
│   │   ├── application.properties       ← Configure database
│   │   └── persistence.xml              ← Configure database
│   └── src/main/java/com/itms/
│       ├── controller/EmployeeTrainingController.java
│       ├── service/EmployeeTrainingService.java
│       ├── entity/                      ← All entity classes
│       ├── repository/                  ← All repository interfaces
│       └── dto/training/                ← All DTOs
├── frontend/
│   ├── src/pages/EmployeeTraining.tsx   ← Main component
│   └── package.json
└── Documentation/
    ├── QUICK_START.md                   ← You are here
    ├── EMPLOYEE_TRAINING_MODULE.md
    ├── API_QUICK_REFERENCE.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── CHANGELOG.md
```

---

## Commands Cheat Sheet

```bash
# Backend
cd ProjectSWP392/backend
mvn clean install                    # Build
mvn spring-boot:run                 # Start
mvn test                            # Test

# Frontend
cd ProjectSWP392/frontend
npm install                         # Install dependencies
npm start                          # Start dev server
npm build                          # Build for production

# Database
# In SQL Server Management Studio:
# 1. Open and execute: 01-training-schema.sql
# 2. Open and execute: 02-training-seed-data.sql

# Testing
# Swagger: http://localhost:8080/swagger-ui.html
# Frontend: http://localhost:3000
# API Base: http://localhost:8080/api/v1/training
```

---

## Success Indicators

✓ SQL Server database created with 9 tables
✓ Sample courses visible in database
✓ Backend running on http://localhost:8080
✓ Swagger UI accessible at /swagger-ui.html
✓ Frontend running on http://localhost:3000
✓ Can GET courses from API
✓ Can POST enroll in courses
✓ Can view dashboard statistics

---

## Additional Resources

- **Full Documentation**: EMPLOYEE_TRAINING_MODULE.md
- **API Reference**: API_QUICK_REFERENCE.md
- **Implementation Details**: IMPLEMENTATION_SUMMARY.md
- **All Changes**: CHANGELOG.md
- **Swagger UI**: http://localhost:8080/swagger-ui.html (when running)

---

## Support

If you encounter issues:
1. Check the "Common Issues & Solutions" section above
2. Review the full documentation
3. Check the API response codes in API_QUICK_REFERENCE.md
4. Verify database connectivity
5. Check application logs

---

**Estimated Total Setup Time: 30 minutes**

Enjoy using the Employee Training Management System!
