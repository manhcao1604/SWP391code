import { employeeApi } from '../../api';
import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeNotificationsPage() {
  const { portal, loading, error, reload } = useEmployeePortal();
  if (loading) return <p>Đang tải thông báo...</p>;
  if (error || !portal) return <p>{error ?? 'Không có dữ liệu.'}</p>;

  const markRead = async (id: number) => {
    await employeeApi.markNotificationRead(id);
    await reload();
  };

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Thông báo</h2>
        <div style={{ marginTop: 12 }}>
          {portal.notifications.map((notice) => (
            <article className="notice-item" key={notice.id}>
              <div>
                <strong>{notice.title}</strong>
                <p style={{ margin: 0 }}>{notice.message}</p>
              </div>
              {!notice.read ? <button className="btn-primary" style={{ maxWidth: 140 }} onClick={() => markRead(notice.id)}>Đánh dấu đã đọc</button> : <span>Đã đọc</span>}
            </article>
          ))}
        </div>
      </section>
      <aside><div className="side-card"><h3>Thông báo chưa đọc</h3><p className="subtle">{portal.notifications.filter((n) => !n.read).length} thông báo.</p></div></aside>
    </div>
  );
}
