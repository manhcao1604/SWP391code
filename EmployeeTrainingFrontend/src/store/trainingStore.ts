import { create } from 'zustand';
import { Course, Category, Enrollment, DashboardStats } from '../api/trainingApi';

interface TrainingStore {
  // State
  courses: Course[];
  categories: Category[];
  enrollments: Enrollment[];
  stats: DashboardStats | null;
  selectedCategory: number | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;

  // Actions
  setCourses: (courses: Course[]) => void;
  setCategories: (categories: Category[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setStats: (stats: DashboardStats) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useTrainingStore = create<TrainingStore>((set) => ({
  // Initial state
  courses: [],
  categories: [],
  enrollments: [],
  stats: null,
  selectedCategory: null,
  searchQuery: '',
  loading: false,
  error: null,

  // Actions
  setCourses: (courses) => set({ courses }),
  setCategories: (categories) => set({ categories }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setStats: (stats) => set({ stats }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () =>
    set({
      courses: [],
      categories: [],
      enrollments: [],
      stats: null,
      selectedCategory: null,
      searchQuery: '',
      loading: false,
      error: null,
    }),
}));
