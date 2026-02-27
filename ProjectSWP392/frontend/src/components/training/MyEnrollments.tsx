import { useState, useEffect } from 'react';
import { CourseEnrollment, trainingApi } from '../../api/training.api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface MyEnrollmentsProps {
  userId: number;
  onCourseSelect?: (enrollmentId: number) => void;
}

export default function MyEnrollments({ userId, onCourseSelect }: MyEnrollmentsProps) {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadEnrollments();
  }, [userId]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await trainingApi.getEnrollments(userId);
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === 'completed') {
      return enrollment.status === 'COMPLETED';
    } else if (filter === 'in-progress') {
      return enrollment.status === 'IN_PROGRESS';
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock size={20} className="text-blue-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        {(['all', 'in-progress', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              filter === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : 'Completed'}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
              {enrollments.filter((e) => {
                if (tab === 'completed') return e.status === 'COMPLETED';
                if (tab === 'in-progress') return e.status === 'IN_PROGRESS';
                return true;
              }).length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading your enrollments...
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'You haven\'t enrolled in any courses yet'
                : `No ${filter.replace('-', ' ')} courses`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                onClick={() => onCourseSelect?.(enrollment.id)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(enrollment.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        Course #{enrollment.courseId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : enrollment.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status === 'IN_PROGRESS' ? 'In Progress' : enrollment.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span>Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                      {enrollment.completionDate && (
                        <span>Completed: {new Date(enrollment.completionDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
