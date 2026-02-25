import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeSchedulePage() {
  const { portal, loading, error } = useEmployeePortal();

  if (loading) return <p>Đang tải lịch học...</p>;
  if (error || !portal) return <p>{error ?? 'Không có dữ liệu lịch học.'}</p>;

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Lịch học sắp tới</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Chủ đề</th>
              <th>Ngày</th>
              <th>Giờ</th>
            </tr>
          </thead>
          <tbody>
            {portal.schedule.map((slot) => (
              <tr key={`${slot.enrollmentId}-${slot.topic}-${slot.sessionDate}`}>
                <td>{slot.courseTitle}</td>
                <td>{slot.topic}</td>
                <td>{slot.sessionDate}</td>
                <td>{slot.startTime} - {slot.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <aside>
        <div className="side-card"><h3>Tổng số buổi</h3><p className="subtle">{portal.schedule.length} buổi học được lên lịch.</p></div>
      </aside>
    </div>
  );
}
