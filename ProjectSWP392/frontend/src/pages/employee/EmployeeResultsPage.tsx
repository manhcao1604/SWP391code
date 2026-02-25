import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeResultsPage() {
  const { portal, loading, error } = useEmployeePortal();
  if (loading) return <p>Đang tải kết quả...</p>;
  if (error || !portal) return <p>{error ?? 'Không có dữ liệu.'}</p>;

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Kết quả & Chứng chỉ</h2>
        <table className="data-table">
          <thead><tr><th>Khóa học</th><th>Điểm số</th><th>Chứng chỉ</th></tr></thead>
          <tbody>
            {portal.results.map((course) => (
              <tr key={course.enrollmentId}>
                <td>{course.title}</td>
                <td>{course.finalScore ?? '-'} / 100</td>
                <td>{course.canDownloadCertificate ? 'Đủ điều kiện tải' : 'Chưa đủ điều kiện'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <aside>
        <div className="side-card"><h3>Chứng chỉ đã có</h3><p className="subtle">{portal.summary.certificates} chứng chỉ.</p></div>
      </aside>
    </div>
  );
}
