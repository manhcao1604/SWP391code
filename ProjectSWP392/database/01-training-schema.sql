-- =====================================================
-- ITMS - Training Module Database Schema
-- =====================================================
-- This script creates tables for the Employee Training Management System
-- Database: ITMS (SQL Server)
-- =====================================================

USE ITMS;
GO

-- =====================================================
-- 1. TRAINING CATEGORY TABLE
-- =====================================================
CREATE TABLE TrainingCategory (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    code NVARCHAR(20) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    icon_url NVARCHAR(255) NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    created_by INT NULL,
    updated_by INT NULL
);

-- =====================================================
-- 2. TRAINING COURSE TABLE
-- =====================================================
CREATE TABLE TrainingCourse (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    code NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    category_id INT NOT NULL,
    trainer_id INT NULL,
    thumbnail_url NVARCHAR(500) NULL,
    
    -- Course details
    duration_hours INT NOT NULL DEFAULT 0,
    level NVARCHAR(20) NOT NULL DEFAULT 'BEGINNER', -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    status NVARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    
    -- Enrollment settings
    max_participants INT NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    enrollment_deadline DATETIME NULL,
    
    -- Metrics
    total_students INT NOT NULL DEFAULT 0,
    total_completed INT NOT NULL DEFAULT 0,
    average_rating FLOAT NULL,
    rating_count INT NOT NULL DEFAULT 0,
    
    is_required BIT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    created_by INT NULL,
    updated_by INT NULL,
    
    CONSTRAINT FK_TrainingCourse_Category FOREIGN KEY (category_id) 
        REFERENCES TrainingCategory(id) ON DELETE RESTRICT,
    CONSTRAINT FK_TrainingCourse_Trainer FOREIGN KEY (trainer_id) 
        REFERENCES [User](id) ON DELETE SET NULL
);

-- =====================================================
-- 3. COURSE CHAPTER/MODULE TABLE
-- =====================================================
CREATE TABLE CourseChapter (
    id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    chapter_order INT NOT NULL,
    description NVARCHAR(MAX) NULL,
    duration_minutes INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_CourseChapter_Course FOREIGN KEY (course_id) 
        REFERENCES TrainingCourse(id) ON DELETE CASCADE
);

CREATE INDEX IX_CourseChapter_CourseId ON CourseChapter(course_id);

-- =====================================================
-- 4. COURSE LESSON TABLE
-- =====================================================
CREATE TABLE CourseLesson (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chapter_id INT NOT NULL,
    course_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    lesson_order INT NOT NULL,
    content_type NVARCHAR(20) NOT NULL, -- VIDEO, DOCUMENT, QUIZ, ASSIGNMENT, DISCUSSION
    content_url NVARCHAR(500) NULL,
    description NVARCHAR(MAX) NULL,
    duration_minutes INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_CourseLesson_Chapter FOREIGN KEY (chapter_id) 
        REFERENCES CourseChapter(id) ON DELETE CASCADE,
    CONSTRAINT FK_CourseLesson_Course FOREIGN KEY (course_id) 
        REFERENCES TrainingCourse(id) ON DELETE CASCADE
);

CREATE INDEX IX_CourseLesson_ChapterId ON CourseLesson(chapter_id);
CREATE INDEX IX_CourseLesson_CourseId ON CourseLesson(course_id);

-- =====================================================
-- 5. COURSE ENROLLMENT TABLE
-- =====================================================
CREATE TABLE CourseEnrollment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_date DATETIME NOT NULL DEFAULT GETDATE(),
    start_date DATETIME NULL,
    completion_date DATETIME NULL,
    
    status NVARCHAR(20) NOT NULL DEFAULT 'ENROLLED', -- ENROLLED, IN_PROGRESS, COMPLETED, DROPPED
    progress_percentage INT NOT NULL DEFAULT 0,
    
    certificate_url NVARCHAR(500) NULL,
    completion_notes NVARCHAR(MAX) NULL,
    
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_Enrollment_Course FOREIGN KEY (course_id) 
        REFERENCES TrainingCourse(id) ON DELETE CASCADE,
    CONSTRAINT FK_Enrollment_User FOREIGN KEY (user_id) 
        REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT UQ_CourseEnrollment_User_Course UNIQUE (course_id, user_id)
);

CREATE INDEX IX_Enrollment_UserId ON CourseEnrollment(user_id);
CREATE INDEX IX_Enrollment_CourseId ON CourseEnrollment(course_id);
CREATE INDEX IX_Enrollment_Status ON CourseEnrollment(status);

-- =====================================================
-- 6. LESSON COMPLETION TRACKING TABLE
-- =====================================================
CREATE TABLE LessonCompletion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    lesson_id INT NOT NULL,
    user_id INT NOT NULL,
    enrollment_id INT NOT NULL,
    completion_date DATETIME NULL,
    
    status NVARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED
    time_spent_minutes INT NOT NULL DEFAULT 0,
    
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_LessonCompletion_Lesson FOREIGN KEY (lesson_id) 
        REFERENCES CourseLesson(id) ON DELETE CASCADE,
    CONSTRAINT FK_LessonCompletion_User FOREIGN KEY (user_id) 
        REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT FK_LessonCompletion_Enrollment FOREIGN KEY (enrollment_id) 
        REFERENCES CourseEnrollment(id) ON DELETE CASCADE,
    CONSTRAINT UQ_LessonCompletion_User_Lesson UNIQUE (lesson_id, user_id)
);

CREATE INDEX IX_LessonCompletion_UserId ON LessonCompletion(user_id);
CREATE INDEX IX_LessonCompletion_LessonId ON LessonCompletion(lesson_id);

-- =====================================================
-- 7. COURSE RATING TABLE
-- =====================================================
CREATE TABLE CourseRating (
    id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL, -- 1-5 stars
    comment NVARCHAR(MAX) NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_CourseRating_Course FOREIGN KEY (course_id) 
        REFERENCES TrainingCourse(id) ON DELETE CASCADE,
    CONSTRAINT FK_CourseRating_User FOREIGN KEY (user_id) 
        REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT CK_CourseRating_Rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT UQ_CourseRating_User_Course UNIQUE (course_id, user_id)
);

CREATE INDEX IX_CourseRating_CourseId ON CourseRating(course_id);
CREATE INDEX IX_CourseRating_UserId ON CourseRating(user_id);

-- =====================================================
-- 8. TRAINING ASSIGNMENT TABLE
-- =====================================================
CREATE TABLE TrainingAssignment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_date DATETIME NOT NULL DEFAULT GETDATE(),
    assigned_by INT NULL,
    
    deadline DATETIME NOT NULL,
    priority NVARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    
    completion_date DATETIME NULL,
    completion_status NVARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, OVERDUE
    notes NVARCHAR(MAX) NULL,
    
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    
    CONSTRAINT FK_Assignment_Course FOREIGN KEY (course_id) 
        REFERENCES TrainingCourse(id) ON DELETE CASCADE,
    CONSTRAINT FK_Assignment_User FOREIGN KEY (user_id) 
        REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT FK_Assignment_AssignedBy FOREIGN KEY (assigned_by) 
        REFERENCES [User](id) ON DELETE SET NULL
);

CREATE INDEX IX_Assignment_UserId ON TrainingAssignment(user_id);
CREATE INDEX IX_Assignment_CourseId ON TrainingAssignment(course_id);
CREATE INDEX IX_Assignment_Status ON TrainingAssignment(completion_status);

-- =====================================================
-- 9. TRAINING NOTIFICATION TABLE
-- =====================================================
CREATE TABLE TrainingNotification (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type NVARCHAR(50) NOT NULL, -- COURSE_ENROLLED, COURSE_STARTED, LESSON_COMPLETED, COURSE_COMPLETED, ASSIGNMENT_DUE
    title NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    related_course_id INT NULL,
    related_assignment_id INT NULL,
    is_read BIT NOT NULL DEFAULT 0,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Notification_User FOREIGN KEY (user_id) 
        REFERENCES [User](id) ON DELETE CASCADE,
    CONSTRAINT FK_Notification_Course FOREIGN KEY (related_course_id) 
        REFERENCES TrainingCourse(id) ON DELETE SET NULL
);

CREATE INDEX IX_Notification_UserId ON TrainingNotification(user_id);
CREATE INDEX IX_Notification_IsRead ON TrainingNotification(is_read);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Training Categories
INSERT INTO TrainingCategory (name, code, description, display_order, is_active)
VALUES 
    (N'Kỹ năng Lập trình', 'PROGRAMMING', N'Các khóa học về lập trình', 1, 1),
    (N'Kỹ năng Mềm', 'SOFT_SKILLS', N'Các khóa học phát triển kỹ năng mềm', 2, 1),
    (N'Quản lý Dự án', 'PROJECT_MGMT', N'Quản lý và lãnh đạo dự án', 3, 1),
    (N'Công nghệ Cloud', 'CLOUD_TECH', N'Các công nghệ điện toán đám mây', 4, 1),
    (N'Bảo mật Thông tin', 'SECURITY', N'Bảo mật và an toàn thông tin', 5, 1);

GO

PRINT 'Training schema created successfully!'
