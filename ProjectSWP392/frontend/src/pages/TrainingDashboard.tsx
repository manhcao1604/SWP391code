import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import DashboardStats from '../components/training/DashboardStats';
import MyEnrollments from '../components/training/MyEnrollments';
import { TrainingDashboard as ITrainingDashboard, trainingApi } from '../api/training.api';
import { BarChart, TrendingUp } from 'lucide-react';

export default function TrainingDashboard() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<ITrainingDashboard | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await trainingApi.getDashboard(user.id);
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Learning Dashboard</h1>
              <p className="text-blue-100 mt-2">
                Welcome back, {user?.email}!
              </p>
            </div>
            <BarChart size={48} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading your dashboard...</div>
          </div>
        ) : dashboard ? (
          <div className="space-y-12">
            {/* Statistics */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Your Stats
              </h2>
              <DashboardStats data={dashboard} />
            </section>

            {/* Recent Courses */}
            {dashboard.recentCourses.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Completed</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboard.recentCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{course.duration} hours</span>
                        <span className="text-green-600 font-semibold">✓ Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Courses */}
            {dashboard.upcomingCourses.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboard.upcomingCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{course.duration} hours</span>
                        <span className="text-blue-600 font-semibold">Coming Soon</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* My Enrollments */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
              <MyEnrollments userId={user?.id || 0} />
            </section>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Failed to load dashboard. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
