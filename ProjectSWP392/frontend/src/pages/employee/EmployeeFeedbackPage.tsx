import { useState } from 'react';
import { employeeApi } from '../../api';
import { useEmployeePortal } from './EmployeePortalContext';

export default function EmployeeFeedbackPage() {
  const { portal, loading, error, reload } = useEmployeePortal();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [suggestions, setSuggestions] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) return <p>Đang tải phản hồi...</p>;
  if (error || !portal || portal.courses.length === 0) return <p>{error ?? 'Không có dữ liệu.'}</p>;

  const targetEnrollment = portal.courses[0].enrollmentId;
  const targetSession = portal.courses[0].sessionId;

  const submit = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      await employeeApi.submitFeedback({ enrollmentId: targetEnrollment, sessionId: targetSession, rating, comment, suggestions });
      setComment('');
      setSuggestions('');
      await reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid-2">
      <section className="panel">
        <h2 className="section-title">Phản hồi của bạn</h2>
        <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
          <label>Điểm đánh giá (1-5)</label>
          <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          <label>Nội dung phản hồi</label>
          <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          <label>Đề xuất cải tiến</label>
          <textarea rows={3} value={suggestions} onChange={(e) => setSuggestions(e.target.value)} />
          <button className="btn-primary" type="button" onClick={submit} disabled={saving}>{saving ? 'Đang gửi...' : 'Gửi phản hồi'}</button>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          {portal.feedbacks.map((feedback) => (
            <article className="item-card" key={feedback.id}>
              <h4 style={{ margin: '0 0 4px' }}>{feedback.courseTitle} ({feedback.rating}/5)</h4>
              <p className="subtle" style={{ margin: 0 }}>{feedback.comment}</p>
            </article>
          ))}
        </div>
      </section>
      <aside><div className="side-card"><h3>Tổng phản hồi</h3><p className="subtle">{portal.feedbacks.length} phản hồi đã gửi.</p></div></aside>
    </div>
  );
}
