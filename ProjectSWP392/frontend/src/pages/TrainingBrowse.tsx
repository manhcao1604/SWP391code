import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import CategoryFilter from '../components/training/CategoryFilter';
import CourseList from '../components/training/CourseList';
import { trainingApi } from '../api/training.api';
import { BookOpen } from 'lucide-react';

export default function TrainingBrowse() {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      alert('Please log in to enroll in courses');
      return;
    }

    try {
      await trainingApi.enrollCourse(user.id, courseId);
      setSuccessMessage('Successfully enrolled in course!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to enroll in course. Please try again.');
      console.error('Enrollment error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={32} />
            <h1 className="text-4xl font-bold">Explore Courses</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Discover and enroll in professional training courses to advance your skills
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-green-800">
            ✓ {successMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <CourseList
              categoryFilter={selectedCategory || undefined}
              onCourseEnroll={handleEnroll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
