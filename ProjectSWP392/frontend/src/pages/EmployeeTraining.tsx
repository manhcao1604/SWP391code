import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Users,
  TrendingUp,
  Loader,
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  code: string;
  description: string;
  categoryName: string;
  thumbnailUrl?: string;
  durationHours: number;
  level: string;
  status: string;
  totalStudents: number;
  totalCompleted: number;
  averageRating?: number;
  ratingCount: number;
  isRequired: boolean;
  enrollmentStatus: number; // 0 = Not enrolled, 1 = Enrolled, 2 = In Progress, 3 = Completed
}

interface DashboardStats {
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  pendingAssignments: number;
  unreadNotifications: number;
}

interface Enrollment {
  id: number;
  courseTitle: string;
  status: string;
  progressPercentage: number;
  completionDate?: string;
}

const EmployeeTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulated API calls - replace with actual API endpoints
      const statsResponse = await fetchStats();
      const coursesResponse = await fetchCourses();
      const enrollmentsResponse = await fetchEnrollments();

      setStats(statsResponse);
      setCourses(coursesResponse);
      setEnrolledCourses(enrollmentsResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<DashboardStats> => {
    // Replace with actual API call
    return {
      totalEnrolledCourses: 8,
      completedCourses: 3,
      inProgressCourses: 5,
      pendingAssignments: 4,
      unreadNotifications: 2,
    };
  };

  const fetchCourses = async (): Promise<Course[]> => {
    // Replace with actual API call
    return [
      {
        id: 1,
        title: 'Lập trình Java Cơ bản',
        code: 'JAVA_101',
        description: 'Khóa học toàn diện về lập trình Java',
        categoryName: 'Kỹ năng Lập trình',
        durationHours: 40,
        level: 'BEGINNER',
        status: 'PUBLISHED',
        totalStudents: 45,
        totalCompleted: 28,
        averageRating: 4.5,
        ratingCount: 42,
        isRequired: true,
        enrollmentStatus: 2, // In Progress
      },
      {
        id: 2,
        title: 'Lập trình Python để Khoa học Dữ liệu',
        code: 'PYTHON_201',
        description: 'Học Python cho Data Science và Machine Learning',
        categoryName: 'Kỹ năng Lập trình',
        durationHours: 50,
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        totalStudents: 32,
        totalCompleted: 18,
        averageRating: 4.7,
        ratingCount: 28,
        isRequired: false,
        enrollmentStatus: 0, // Not enrolled
      },
      {
        id: 3,
        title: 'Kỹ năng Lãnh đạo và Quản lý',
        code: 'LEADSHP_101',
        description: 'Phát triển kỹ năng lãnh đạo',
        categoryName: 'Kỹ năng Mềm',
        durationHours: 30,
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        totalStudents: 58,
        totalCompleted: 52,
        averageRating: 4.8,
        ratingCount: 55,
        isRequired: true,
        enrollmentStatus: 1, // Enrolled
      },
    ];
  };

  const fetchEnrollments = async (): Promise<Enrollment[]> => {
    // Replace with actual API call
    return [
      {
        id: 1,
        courseTitle: 'Lập trình Java Cơ bản',
        status: 'IN_PROGRESS',
        progressPercentage: 65,
      },
      {
        id: 2,
        courseTitle: 'Kỹ năng Lãnh đạo và Quản lý',
        status: 'ENROLLED',
        progressPercentage: 20,
      },
      {
        id: 3,
        courseTitle: 'AWS Cloud Architecture',
        status: 'COMPLETED',
        progressPercentage: 100,
        completionDate: '2024-01-15',
      },
    ];
  };

  const handleEnrollCourse = async (courseId: number) => {
    try {
      // Replace with actual API call
      console.log('Enrolling in course:', courseId);
      // After successful enrollment, update UI
      fetchDashboardData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  const chartData = [
    { name: 'Hoàn thành', value: stats?.completedCourses || 0 },
    { name: 'Đang học', value: stats?.inProgressCourses || 0 },
  ];

  const progressData = enrolledCourses.map((course) => ({
    name: course.courseTitle.substring(0, 20),
    progress: course.progressPercentage,
  }));

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trung tâm Đào tạo
          </h1>
          <p className="text-gray-600">
            Phát triển kỹ năng của bạn thông qua các khóa học chuyên nghiệp
          </p>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={<BookOpen className="text-blue-600" />}
              title="Khóa học"
              value={stats.totalEnrolledCourses}
              subtitle="Đã đăng ký"
            />
            <StatCard
              icon={<CheckCircle className="text-green-600" />}
              title="Hoàn thành"
              value={stats.completedCourses}
              subtitle="Khóa học"
            />
            <StatCard
              icon={<Clock className="text-orange-600" />}
              title="Đang học"
              value={stats.inProgressCourses}
              subtitle="Khóa học"
            />
            <StatCard
              icon={<AlertCircle className="text-red-600" />}
              title="Công việc"
              value={stats.pendingAssignments}
              subtitle="Chưa hoàn thành"
            />
            <StatCard
              icon={<TrendingUp className="text-purple-600" />}
              title="Thông báo"
              value={stats.unreadNotifications}
              subtitle="Chưa đọc"
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="dashboard">Bảng điều khiển</TabsTrigger>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="progress">Tiến độ</TabsTrigger>
            <TabsTrigger value="resources">Tài nguyên</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Tiến độ học tập</CardTitle>
                  <CardDescription>
                    Khóa học hoàn thành vs đang học
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Enrollments */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Khóa học gần đây</CardTitle>
                  <CardDescription>
                    Khóa học bạn đang tham gia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">
                            {enrollment.courseTitle}
                          </h4>
                          <span className="text-xs font-bold text-blue-600">
                            {enrollment.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${enrollment.progressPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Status: {enrollment.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tiến độ chi tiết</CardTitle>
                <CardDescription>
                  Tiến độ học tập cho từng khóa học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnrollCourse}
                />
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tổng quan tiến độ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {enrolledCourses.map((enrollment) => (
                    <ProgressItem
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tài nguyên học tập</CardTitle>
                <CardDescription>
                  Tài liệu và công cụ hữu ích cho quá trình học tập
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Tài liệu Chính thức"
                    description="Tài liệu và hướng dẫn từ các khóa học"
                    icon="📚"
                  />
                  <ResourceCard
                    title="Video Hướng dẫn"
                    description="Video chi tiết giải thích từng chủ đề"
                    icon="🎥"
                  />
                  <ResourceCard
                    title="Diễn đàn Cộng đồng"
                    description="Trao đổi với các học viên khác"
                    icon="💬"
                  />
                  <ResourceCard
                    title="Hỗ trợ Kỹ thuật"
                    description="Liên hệ với đội hỗ trợ của chúng tôi"
                    icon="🆘"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Components
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
}) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => (
  <Card className="shadow-lg hover:shadow-xl transition-all overflow-hidden">
    {course.thumbnailUrl && (
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
    )}
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <CardDescription>{course.categoryName}</CardDescription>
        </div>
        {course.isRequired && (
          <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
            Bắt buộc
          </span>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-gray-600 line-clamp-2">
        {course.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <Clock size={16} className="text-gray-500" />
          <span>{course.durationHours} giờ</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {course.level}
        </span>
      </div>

      {course.averageRating && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(course.averageRating!)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({course.ratingCount})
          </span>
        </div>
      )}

      <div className="pt-4">
        {course.enrollmentStatus === 0 && (
          <Button
            onClick={() => onEnrollCourse(course.id)}
            className="w-full"
            variant="default"
          >
            Đăng ký khóa học
          </Button>
        )}
        {course.enrollmentStatus === 1 && (
          <Button disabled className="w-full" variant="secondary">
            Đã đăng ký
          </Button>
        )}
        {course.enrollmentStatus === 2 && (
          <Button disabled className="w-full" variant="outline">
            Đang học
          </Button>
        )}
        {course.enrollmentStatus === 3 && (
          <Button disabled className="w-full" variant="ghost">
            Hoàn thành ✓
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

interface ProgressItemProps {
  enrollment: Enrollment;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ enrollment }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold">{enrollment.courseTitle}</h4>
      <span className="text-sm font-bold text-blue-600">
        {enrollment.progressPercentage}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
        style={{ width: `${enrollment.progressPercentage}%` }}
      ></div>
    </div>
    <p className="text-xs text-gray-500 mt-2">Status: {enrollment.status}</p>
  </div>
);

interface ResourceCardProps {
  title: string;
  description: string;
  icon: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  icon,
}) => (
  <Card className="shadow hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <Button variant="ghost" className="mt-4 p-0">
        Tìm hiểu thêm →
      </Button>
    </CardContent>
  </Card>
);

export default EmployeeTraining;
