import { useState, useEffect } from 'react';
import { TrainingCourse, trainingApi } from '../../api/training.api';
import CourseCard from './CourseCard';
import { Search, Filter } from 'lucide-react';

interface CourseListProps {
  categoryFilter?: number;
  onCourseEnroll?: (courseId: number) => void;
}

export default function CourseList({ categoryFilter, onCourseEnroll }: CourseListProps) {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [categoryFilter, searchQuery]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let response;

      if (searchQuery) {
        response = await trainingApi.searchCourses(searchQuery, page, 12);
      } else if (categoryFilter) {
        response = await trainingApi.getCoursesByCategory(categoryFilter, page, 12);
      } else {
        response = await trainingApi.getAllCourses(page, 12);
      }

      setCourses(response.content || response);
      setHasMore(response.hasNext !== false);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Courses Grid */}
      <div>
        {loading && courses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">No courses found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={onCourseEnroll}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setPage(page + 1);
              loadCourses();
            }}
            disabled={loading}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
