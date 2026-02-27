import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Course {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  categoryId: number;
  categoryName: string;
  instructor: string;
  duration: number;
  level: string;
  rating: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  courseCount: number;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  courseName: string;
  enrollmentDate: string;
  completionPercentage: number;
  status: string;
}

export interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: number;
  order: number;
  isCompleted: boolean;
}

export interface Chapter {
  id: number;
  courseId: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  chapters: Chapter[];
  totalLessons: number;
  completedLessons: number;
  isEnrolled: boolean;
}

export interface Rating {
  id: number;
  courseId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalEnrollments: number;
  completedCourses: number;
  inProgressCourses: number;
  averageRating: number;
  totalLearningHours: number;
}

// Course APIs
export const trainingApi = {
  // Get all courses
  getAllCourses: (page = 0, size = 10, search = '', categoryId?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      search,
      ...(categoryId && { categoryId: categoryId.toString() }),
    });
    return api.get<Course[]>(`/api/training/courses?${params}`);
  },

  // Get course details
  getCourseDetail: (courseId: number) =>
    api.get<CourseDetail>(`/api/training/courses/${courseId}`),

  // Get all categories
  getCategories: () =>
    api.get<Category[]>('/api/training/categories'),

  // Enroll in course
  enrollCourse: (courseId: number) =>
    api.post(`/api/training/enrollments`, { courseId }),

  // Get user enrollments
  getMyEnrollments: () =>
    api.get<Enrollment[]>('/api/training/my-enrollments'),

  // Get course chapters
  getCourseChapters: (courseId: number) =>
    api.get<Chapter[]>(`/api/training/courses/${courseId}/chapters`),

  // Get lessons
  getLessons: (chapterId: number) =>
    api.get<Lesson[]>(`/api/training/chapters/${chapterId}/lessons`),

  // Mark lesson as complete
  completeLesson: (lessonId: number) =>
    api.post(`/api/training/lessons/${lessonId}/complete`),

  // Submit course rating
  submitRating: (courseId: number, rating: number, comment: string) =>
    api.post(`/api/training/courses/${courseId}/ratings`, {
      rating,
      comment,
    }),

  // Get course ratings
  getCourseRatings: (courseId: number) =>
    api.get<Rating[]>(`/api/training/courses/${courseId}/ratings`),

  // Get dashboard statistics
  getDashboardStats: () =>
    api.get<DashboardStats>('/api/training/dashboard/stats'),

  // Get enrollment progress
  getEnrollmentProgress: (enrollmentId: number) =>
    api.get(`/api/training/enrollments/${enrollmentId}/progress`),

  // Search courses
  searchCourses: (query: string) =>
    api.get<Course[]>('/api/training/courses/search', {
      params: { q: query },
    }),
};

export default api;
