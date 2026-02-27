import axios from 'axios';

const API_URL = 'http://localhost:8080/api/training';

// Interfaces
export interface TrainingCourse {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  duration: number;
  level: string;
  instructorName: string;
  imageUrl?: string;
  createdDate?: string;
  status: string;
}

export interface CourseChapter {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
}

export interface CourseLesson {
  id: number;
  chapterId: number;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  orderIndex: number;
}

export interface CourseEnrollment {
  id: number;
  courseId: number;
  userId: number;
  enrollmentDate: string;
  status: string;
  progress: number;
  completionDate?: string;
}

export interface LessonCompletion {
  id: number;
  enrollmentId: number;
  lessonId: number;
  completionDate: string;
}

export interface CourseRating {
  id: number;
  enrollmentId: number;
  rating: number;
  comment: string;
  ratingDate: string;
}

export interface TrainingCategory {
  id: number;
  name: string;
  description: string;
}

export interface TrainingDashboard {
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageRating: number;
  recentCourses: TrainingCourse[];
  upcomingCourses: TrainingCourse[];
}

// API Calls
export const trainingApi = {
  // Dashboard
  getDashboard: async (userId: number): Promise<TrainingDashboard> => {
    const response = await axios.get(`${API_URL}/dashboard/${userId}`);
    return response.data;
  },

  // Courses
  getAllCourses: async (page = 0, size = 10): Promise<any> => {
    const response = await axios.get(`${API_URL}/courses`, {
      params: { page, size }
    });
    return response.data;
  },

  getCoursesByCategory: async (categoryId: number, page = 0, size = 10): Promise<any> => {
    const response = await axios.get(`${API_URL}/courses/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  searchCourses: async (keyword: string, page = 0, size = 10): Promise<any> => {
    const response = await axios.get(`${API_URL}/courses/search`, {
      params: { keyword, page, size }
    });
    return response.data;
  },

  getCourseDetail: async (courseId: number): Promise<TrainingCourse> => {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<TrainingCategory[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // Chapters
  getChaptersByCourse: async (courseId: number): Promise<CourseChapter[]> => {
    const response = await axios.get(`${API_URL}/chapters/course/${courseId}`);
    return response.data;
  },

  // Lessons
  getLessonsByChapter: async (chapterId: number): Promise<CourseLesson[]> => {
    const response = await axios.get(`${API_URL}/lessons/chapter/${chapterId}`);
    return response.data;
  },

  getLessonDetail: async (lessonId: number): Promise<CourseLesson> => {
    const response = await axios.get(`${API_URL}/lessons/${lessonId}`);
    return response.data;
  },

  // Enrollments
  enrollCourse: async (userId: number, courseId: number): Promise<CourseEnrollment> => {
    const response = await axios.post(`${API_URL}/enrollments`, {
      userId,
      courseId
    });
    return response.data;
  },

  getEnrollments: async (userId: number): Promise<CourseEnrollment[]> => {
    const response = await axios.get(`${API_URL}/enrollments/user/${userId}`);
    return response.data;
  },

  getEnrollmentDetail: async (enrollmentId: number): Promise<any> => {
    const response = await axios.get(`${API_URL}/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Lesson Completions
  completeLesson: async (enrollmentId: number, lessonId: number): Promise<LessonCompletion> => {
    const response = await axios.post(`${API_URL}/completions`, {
      enrollmentId,
      lessonId
    });
    return response.data;
  },

  getCompletions: async (enrollmentId: number): Promise<LessonCompletion[]> => {
    const response = await axios.get(`${API_URL}/completions/enrollment/${enrollmentId}`);
    return response.data;
  },

  // Ratings
  rateCourse: async (enrollmentId: number, rating: number, comment: string): Promise<CourseRating> => {
    const response = await axios.post(`${API_URL}/ratings`, {
      enrollmentId,
      rating,
      comment
    });
    return response.data;
  },

  getCourseRatings: async (courseId: number): Promise<CourseRating[]> => {
    const response = await axios.get(`${API_URL}/ratings/course/${courseId}`);
    return response.data;
  }
};
