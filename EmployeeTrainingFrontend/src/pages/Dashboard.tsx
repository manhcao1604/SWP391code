import { useEffect, useState } from 'react';
import { BookOpen, Users, CheckCircle, Star } from 'lucide-react';
import { trainingApi, DashboardStats, Enrollment } from '../api/trainingApi';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsRes, enrollmentsRes] = await Promise.all([
          trainingApi.getDashboardStats(),
          trainingApi.getMyEnrollments(),
        ]);
        setStats(statsRes.data);
        setEnrollments(enrollmentsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('[v0] Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">
            Track your learning progress and discover new courses
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Enrolled Courses"
              value={stats.totalEnrollments}
              icon={<BookOpen size={24} />}
              color="blue"
            />
            <StatsCard
              title="In Progress"
              value={stats.inProgressCourses}
              icon={<Users size={24} />}
              color="purple"
            />
            <StatsCard
              title="Completed"
              value={stats.completedCourses}
              icon={<CheckCircle size={24} />}
              color="green"
            />
            <StatsCard
              title="Average Rating"
              value={`${stats.averageRating.toFixed(1)}/5`}
              icon={<Star size={24} />}
              color="orange"
            />
          </div>
        )}

        {/* My Enrollments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link
              to="/browse"
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              Browse More →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No courses yet. Start learning today!
              </p>
              <Link
                to="/browse"
                className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {enrollment.courseName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Enrolled on{' '}
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/course/${enrollment.courseId}`}
                      className="text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Continue →
                    </Link>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-600">
                        Progress
                      </span>
                      <span className="text-xs font-bold text-primary-600">
                        {enrollment.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${enrollment.completionPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
