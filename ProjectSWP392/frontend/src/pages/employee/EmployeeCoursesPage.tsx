import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeCoursesPage() {
  const { portal, loading, error } = useEmployeePortal();

  if (loading) return <p>Đang tải khóa học...</p>;
  if (error || !portal) return <p>{error ?? 'Không có dữ liệu khóa học.'}</p>;

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Khóa học của bạn</h2>
        <div className="course-grid">
          {portal.courses.map((course) => (
            <article className="item-card" key={course.enrollmentId}>
              <h3 style={{ margin: '0 0 4px' }}>{course.title}</h3>
              <p className="subtle">Nhóm kỹ năng: {course.category}</p>
              <p className="subtle">Trạng thái: {course.completionStatus}</p>
              <div className="progress-track" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${course.progressPercent}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside>
        <div className="side-card"><h3>Số khóa học</h3><p className="subtle">{portal.courses.length} khóa đang quản lý.</p></div>
      </aside>
    </div>
  );
}
