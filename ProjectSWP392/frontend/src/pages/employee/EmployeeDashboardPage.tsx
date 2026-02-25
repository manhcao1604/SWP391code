import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeDashboardPage() {
  const { portal, loading, error } = useEmployeePortal();

  if (loading) return <p>Đang tải dữ liệu dashboard...</p>;
  if (error || !portal) return <p>{error ?? 'Không có dữ liệu.'}</p>;

  const stats = [
    { label: 'Khóa học đang học', value: portal.summary.activeCourses, accent: 'blue' },
    { label: 'Khóa học hoàn thành', value: portal.summary.completedCourses, accent: 'green' },
    { label: 'Tiến độ trung bình', value: `${portal.summary.averageProgress}%`, accent: 'yellow' },
  ];

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Tổng quan</h2>
        <p className="subtle">Theo dõi hiệu suất học tập và lộ trình phát triển kỹ năng.</p>
        <div className="grid-3" style={{ marginTop: 12 }}>
          {stats.map((item) => (
            <article className={`kpi ${item.accent}`} key={item.label}>
              <div className="kpi-value">{item.value}</div>
              <div className="kpi-label">{item.label}</div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <div className="side-card">
          <h3>Hồ sơ người dùng</h3>
          <p className="subtle">Số chứng chỉ đã đạt: {portal.summary.certificates}</p>
        </div>
        <div className="side-card">
          <h3>Thông báo nhanh</h3>
          <p className="subtle">Bạn có {portal.notifications.filter((n) => !n.read).length} thông báo chưa đọc.</p>
        </div>
      </aside>
    </div>
  );
}
