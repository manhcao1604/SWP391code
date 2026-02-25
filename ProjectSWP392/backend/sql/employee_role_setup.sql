/* =====================================================
   ITMS - Employee Role Database Extension (SQL Server)
   Compatible with existing schema Course/Session/Enrollment...
   Server: DESKTOP-P6UL4J8\SQLEXPRESS01
   DB: ITMS
   Auth: sa / 123123
   ===================================================== */

USE ITMS;
GO

/* 1) Indexes tối ưu truy vấn Employee Portal */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Enrollment_User_Status' AND object_id = OBJECT_ID('Enrollment'))
    CREATE INDEX IX_Enrollment_User_Status ON Enrollment(user_id, status, completion_date DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Session_Course_Date' AND object_id = OBJECT_ID('Session'))
    CREATE INDEX IX_Session_Course_Date ON Session(course_id, [date], time_start);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Notification_User_Read' AND object_id = OBJECT_ID('Notification'))
    CREATE INDEX IX_Notification_User_Read ON Notification(user_id, is_read, sent_date DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Feedback_User_Submitted' AND object_id = OBJECT_ID('Feedback'))
    CREATE INDEX IX_Feedback_User_Submitted ON Feedback(user_id, submitted_at DESC);
GO

/* 2) View tổng hợp dashboard employee */
IF OBJECT_ID('vw_EmployeeDashboardSummary', 'V') IS NOT NULL
    DROP VIEW vw_EmployeeDashboardSummary;
GO

CREATE VIEW vw_EmployeeDashboardSummary AS
SELECT
    e.user_id,
    COUNT(DISTINCT s.course_id) AS total_courses,
    SUM(CASE WHEN e.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_enrollments,
    CAST(AVG(CAST(ISNULL(e.completion_rate,0) AS FLOAT)) AS DECIMAL(5,2)) AS avg_completion_rate,
    SUM(CASE WHEN e.certificate_issued = 1 THEN 1 ELSE 0 END) AS issued_certificates
FROM Enrollment e
JOIN Session s ON s.id = e.session_id
GROUP BY e.user_id;
GO

/* 3) Stored procedure lấy dữ liệu portal cho employee */
IF OBJECT_ID('sp_GetEmployeePortalData', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetEmployeePortalData;
GO

CREATE PROCEDURE sp_GetEmployeePortalData
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Summary
    SELECT *
    FROM vw_EmployeeDashboardSummary
    WHERE user_id = @UserId;

    -- Upcoming schedule
    SELECT
        e.id AS enrollment_id,
        c.id AS course_id,
        c.name AS course_name,
        s.id AS session_id,
        s.session_name,
        s.[date],
        s.time_start,
        s.time_end,
        s.location_type,
        s.meeting_link,
        s.status
    FROM Enrollment e
    JOIN Session s ON s.id = e.session_id
    JOIN Course c ON c.id = s.course_id
    WHERE e.user_id = @UserId
      AND s.[date] >= CAST(GETDATE() AS DATE)
    ORDER BY s.[date], s.time_start;

    -- Results + certificate
    SELECT
        e.id AS enrollment_id,
        c.name AS course_name,
        e.status,
        e.completion_rate,
        e.final_score,
        e.certificate_issued,
        cert.certificate_code,
        cert.certificate_url,
        cert.issue_date
    FROM Enrollment e
    JOIN Session s ON s.id = e.session_id
    JOIN Course c ON c.id = s.course_id
    LEFT JOIN Certificate cert ON cert.enrollment_id = e.id AND cert.is_valid = 1
    WHERE e.user_id = @UserId
    ORDER BY e.created_at DESC;

    -- Notifications
    SELECT
        id, [type], title, message, is_read, read_at, sent_date, priority
    FROM Notification
    WHERE user_id = @UserId
    ORDER BY sent_date DESC;
END;
GO

/* 4) Procedure mark notification read */
IF OBJECT_ID('sp_MarkNotificationRead', 'P') IS NOT NULL
    DROP PROCEDURE sp_MarkNotificationRead;
GO

CREATE PROCEDURE sp_MarkNotificationRead
    @UserId INT,
    @NotificationId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Notification
    SET is_read = 1,
        read_at = GETDATE()
    WHERE id = @NotificationId
      AND user_id = @UserId;
END;
GO

/* 5) Seed dữ liệu mẫu role Employee */
DECLARE @EmpId INT = (SELECT TOP 1 id FROM [User] WHERE username = 'emp001');
DECLARE @TrainerId INT = (SELECT TOP 1 id FROM [User] WHERE username = 'trainer001');

IF @EmpId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Course WHERE code = 'EMP-PY-001')
    BEGIN
        INSERT INTO Course(code, name, description, category, level, passing_score, duration_hours, trainer_id, status, created_at)
        VALUES ('EMP-PY-001', N'Lập trình Python cơ bản', N'Khóa nền tảng Python cho nhân viên mới.', N'Programming', 'BEGINNER', 70, 24, @TrainerId, 'ACTIVE', GETDATE());
    END

    IF NOT EXISTS (SELECT 1 FROM Course WHERE code = 'EMP-SQL-001')
    BEGIN
        INSERT INTO Course(code, name, description, category, level, passing_score, duration_hours, trainer_id, status, created_at)
        VALUES ('EMP-SQL-001', N'Cơ sở dữ liệu SQL', N'Truy vấn SQL và tối ưu dữ liệu cho nghiệp vụ.', N'Data', 'BEGINNER', 75, 20, @TrainerId, 'ACTIVE', GETDATE());
    END

    DECLARE @CoursePy INT = (SELECT id FROM Course WHERE code = 'EMP-PY-001');
    DECLARE @CourseSql INT = (SELECT id FROM Course WHERE code = 'EMP-SQL-001');

    IF NOT EXISTS (SELECT 1 FROM Session WHERE course_id = @CoursePy AND session_name = N'Python Variables & Functions')
    BEGIN
        INSERT INTO Session(course_id, session_name, session_number, [date], time_start, time_end, location_type, meeting_link, max_capacity, current_enrolled, status, created_at)
        VALUES (@CoursePy, N'Python Variables & Functions', 1, DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '09:00', '11:00', 'ONLINE', 'https://meet.company.local/python-1', 50, 1, 'SCHEDULED', GETDATE());
    END

    IF NOT EXISTS (SELECT 1 FROM Session WHERE course_id = @CourseSql AND session_name = N'SQL Join và Subquery')
    BEGIN
        INSERT INTO Session(course_id, session_name, session_number, [date], time_start, time_end, location_type, meeting_link, max_capacity, current_enrolled, status, created_at)
        VALUES (@CourseSql, N'SQL Join và Subquery', 1, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), '14:00', '16:00', 'ONLINE', 'https://meet.company.local/sql-1', 50, 1, 'COMPLETED', GETDATE());
    END
END
GO
