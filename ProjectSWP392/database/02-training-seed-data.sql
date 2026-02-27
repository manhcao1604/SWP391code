-- =====================================================
-- ITMS - Training Module Seed Data
-- =====================================================
-- This script inserts sample data for training courses and related information
-- Database: ITMS (SQL Server)
-- =====================================================

USE ITMS;
GO

-- =====================================================
-- INSERT SAMPLE COURSES
-- =====================================================

-- Insert Java Programming Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'Lập trình Java Cơ bản',
    'JAVA_101',
    N'Khóa học toàn diện về lập trình Java từ cơ bản đến nâng cao. Bạn sẽ học OOP, Collections, File I/O và nhiều khái niệm quan trọng khác.',
    1,
    NULL,
    'https://via.placeholder.com/300x200?text=Java+Programming',
    40,
    'BEGINNER',
    'PUBLISHED',
    DATEADD(DAY, 1, GETDATE()),
    DATEADD(DAY, 90, GETDATE()),
    50,
    1,
    1
);

-- Insert Python Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'Lập trình Python để Khoa học Dữ liệu',
    'PYTHON_201',
    N'Học Python cho Data Science và Machine Learning. Bao gồm NumPy, Pandas, Matplotlib và Scikit-learn.',
    1,
    NULL,
    'https://via.placeholder.com/300x200?text=Python+Data+Science',
    50,
    'INTERMEDIATE',
    'PUBLISHED',
    DATEADD(DAY, 5, GETDATE()),
    DATEADD(DAY, 95, GETDATE()),
    40,
    0,
    1
);

-- Insert Leadership Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'Kỹ năng Lãnh đạo và Quản lý',
    'LEADSHP_101',
    N'Phát triển kỹ năng lãnh đạo, giao tiếp hiệu quả, quản lý thời gian và xây dựng đội nhóm mạnh mẽ.',
    2,
    NULL,
    'https://via.placeholder.com/300x200?text=Leadership+Skills',
    30,
    'INTERMEDIATE',
    'PUBLISHED',
    DATEADD(DAY, 7, GETDATE()),
    DATEADD(DAY, 75, GETDATE()),
    60,
    1,
    1
);

-- Insert Project Management Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'Quản lý Dự án với Agile/Scrum',
    'PROJMGMT_201',
    N'Học phương pháp quản lý dự án hiệu quả sử dụng Agile, Scrum, và các công cụ quản lý dự án.',
    3,
    NULL,
    'https://via.placeholder.com/300x200?text=Project+Management',
    35,
    'INTERMEDIATE',
    'PUBLISHED',
    DATEADD(DAY, 10, GETDATE()),
    DATEADD(DAY, 80, GETDATE()),
    45,
    1,
    1
);

-- Insert Cloud AWS Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'AWS Cloud Architecture Essentials',
    'AWS_201',
    N'Tìm hiểu kiến trúc đám mây AWS, EC2, S3, RDS, Lambda, API Gateway và các dịch vụ quan trọng khác.',
    4,
    NULL,
    'https://via.placeholder.com/300x200?text=AWS+Cloud',
    45,
    'ADVANCED',
    'PUBLISHED',
    DATEADD(DAY, 15, GETDATE()),
    DATEADD(DAY, 100, GETDATE()),
    30,
    0,
    1
);

-- Insert Security Basics Course
INSERT INTO TrainingCourse (title, code, description, category_id, trainer_id, thumbnail_url, duration_hours, level, status, start_date, end_date, max_participants, is_required, is_active)
VALUES (
    N'Bảo mật Thông tin và Best Practices',
    'SECURITY_101',
    N'Hiểu về bảo mật thông tin, mã hóa, xác thực, phòng chống tấn công phổ biến và compliance.',
    5,
    NULL,
    'https://via.placeholder.com/300x200?text=Information+Security',
    25,
    'BEGINNER',
    'PUBLISHED',
    DATEADD(DAY, 3, GETDATE()),
    DATEADD(DAY, 60, GETDATE()),
    100,
    1,
    1
);

GO

-- =====================================================
-- INSERT CHAPTERS FOR JAVA COURSE
-- =====================================================

DECLARE @JAVA_COURSE_ID INT = (SELECT TOP 1 id FROM TrainingCourse WHERE code = 'JAVA_101');

INSERT INTO CourseChapter (course_id, title, chapter_order, description, duration_minutes)
VALUES 
    (@JAVA_COURSE_ID, N'Java Cơ bản và Thiết lập Môi trường', 1, N'Giới thiệu Java, cài đặt JDK, và viết chương trình đầu tiên', 180),
    (@JAVA_COURSE_ID, N'Các Biến, Kiểu Dữ liệu và Toán tử', 2, N'Tìm hiểu về biến, primitive types, operators', 240),
    (@JAVA_COURSE_ID, N'Luồng Điều khiển', 3, N'If/else, switch, loops, break/continue', 200),
    (@JAVA_COURSE_ID, N'Hướng đối tượng (OOP)', 4, N'Classes, Objects, Inheritance, Polymorphism', 300),
    (@JAVA_COURSE_ID, N'Collections Framework', 5, N'List, Set, Map, Iterators, Streams', 280);

GO

-- =====================================================
-- INSERT LESSONS FOR JAVA CHAPTER 1
-- =====================================================

DECLARE @CHAPTER_ID INT = (SELECT TOP 1 id FROM CourseChapter WHERE title = N'Java Cơ bản và Thiết lập Môi trường');
DECLARE @JAVA_COURSE_ID INT = (SELECT TOP 1 id FROM TrainingCourse WHERE code = 'JAVA_101');

INSERT INTO CourseLesson (chapter_id, course_id, title, lesson_order, content_type, content_url, description, duration_minutes)
VALUES
    (@CHAPTER_ID, @JAVA_COURSE_ID, N'Giới thiệu Java', 1, 'VIDEO', 'https://example.com/java-intro.mp4', N'Video giới thiệu về Java', 45),
    (@CHAPTER_ID, @JAVA_COURSE_ID, N'Cài đặt JDK', 2, 'DOCUMENT', 'https://example.com/jdk-setup.pdf', N'Hướng dẫn cài đặt JDK trên Windows/Mac/Linux', 30),
    (@CHAPTER_ID, @JAVA_COURSE_ID, N'Hello World Program', 3, 'VIDEO', 'https://example.com/hello-world.mp4', N'Viết và chạy chương trình Hello World đầu tiên', 40),
    (@CHAPTER_ID, @JAVA_COURSE_ID, N'Quiz: Java Cơ bản', 4, 'QUIZ', NULL, N'Kiểm tra kiến thức cơ bản về Java', 20);

GO

-- =====================================================
-- INSERT SAMPLE USERS (If not exists)
-- =====================================================

-- Note: Users should already exist from previous seeding
-- This section is just for reference

GO

PRINT 'Training seed data inserted successfully!'
