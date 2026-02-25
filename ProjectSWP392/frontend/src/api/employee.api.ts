import axios from '../lib/axios';

export interface EmployeePortalResponse {
  summary: {
    activeCourses: number;
    completedCourses: number;
    averageProgress: number;
    certificates: number;
  };
  schedule: Array<{
    enrollmentId: number;
    courseTitle: string;
    topic: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
  }>;
  courses: Array<{
    enrollmentId: number;
    courseId: number;
    sessionId: number;
    title: string;
    category: string;
    progressPercent: number;
    completionStatus: string;
  }>;
  results: Array<{
    enrollmentId: number;
    title: string;
    finalScore: number | null;
    completionStatus: string;
    canDownloadCertificate: boolean;
  }>;
  feedbacks: Array<{
    id: number;
    courseTitle: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
  }>;
}

export const employeeApi = {
  getPortal: () => axios.get<{ data: EmployeePortalResponse; message: string }>('/employee/portal'),
  submitFeedback: (payload: { enrollmentId: number; sessionId: number; rating: number; comment: string; suggestions?: string }) =>
    axios.post('/employee/feedback', payload),
  markNotificationRead: (id: number) => axios.patch(`/employee/notifications/${id}/read`),
};
