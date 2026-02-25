import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import '../assets/styles/EmployeePortal.css';
import { useCallback, useEffect, useState } from 'react';
import { employeeApi, type EmployeePortalResponse } from '../api';
import { EmployeePortalContext } from '../pages/employee/EmployeePortalContext';

const navItems = [
  { to: '/employee', label: 'Dashboard' },
  { to: '/employee/schedule', label: 'Lịch học' },
  { to: '/employee/courses', label: 'Khóa học' },
  { to: '/employee/course-detail', label: 'Chi tiết khóa học' },
  { to: '/employee/results', label: 'Kết quả & Chứng chỉ' },
  { to: '/employee/feedback', label: 'Phản hồi' },
  { to: '/employee/notifications', label: 'Thông báo' },
];

export default function EmployeeLayout() {
  const { user } = useAuthStore();
  const [portal, setPortal] = useState<EmployeePortalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeeApi.getPortal();
      setPortal(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Không thể tải dữ liệu employee portal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <EmployeePortalContext.Provider value={{ portal, loading, error, reload }}>
      <div className="employee-shell">
        <header className="employee-topbar">
          <div className="employee-topbar-inner">
            <h1 className="employee-brand">Employee Learning Portal</h1>
            <span className="employee-user">{user?.email}</span>
            <nav className="employee-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.to === '/employee'}
                  to={item.to}
                  className={({ isActive }) =>
                    `employee-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="employee-content">
          <Outlet />
        </main>
      </div>
    </EmployeePortalContext.Provider>
  );
}
