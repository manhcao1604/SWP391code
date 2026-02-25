import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeCourseDetailPage() {
  const { portal, loading, error } = useEmployeePortal();
  if (loading) return <p>Đang tải chi tiết khóa học...</p>;
  if (error || !portal || portal.courses.length === 0) return <p>{error ?? 'Không có dữ liệu.'}</p>;

  const focused = portal.courses[0];

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">{focused.title}</h2>
        <p className="subtle">Nhóm kỹ năng: {focused.category}</p>
        <p style={{ margin: '14px 0 8px', fontWeight: 600 }}>Course Progress</p>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${focused.progressPercent}%` }} /></div>
        <p className="subtle" style={{ marginTop: 6 }}>{focused.progressPercent}% completed</p>
      </section>
      <aside>
        <div className="side-card course-summary">
          <h3>Completion Status</h3>
          <p className="subtle">{focused.completionStatus}</p>
        </div>
      </aside>
    </div>
  );
}
