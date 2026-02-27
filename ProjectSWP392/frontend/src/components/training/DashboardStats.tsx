import { TrainingDashboard } from '../../api/training.api';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';

interface DashboardStatsProps {
  data: TrainingDashboard;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Enrolled Courses',
      value: data.totalEnrolledCourses,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Completed',
      value: data.completedCourses,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'In Progress',
      value: data.inProgressCourses,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Avg Rating',
      value: data.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
