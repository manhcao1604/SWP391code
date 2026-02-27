import { Star, Users, Clock, TrendingUp } from 'lucide-react';
import { Course } from '../api/trainingApi';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
}

export const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onEnroll && (e.target as HTMLElement).closest('.enroll-btn')) {
      e.preventDefault();
      onEnroll(course.id);
    }
  };

  return (
    <Link
      to={`/course/${course.id}`}
      onClick={handleClick}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        <img
          src={course.thumbnail || 'https://via.placeholder.com/300x200?text=Course'}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {course.level || 'Beginner'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-primary-600 font-medium mb-2 uppercase tracking-wider">
          {course.categoryName}
        </p>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
          {course.name}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">
          {course.instructor || 'No instructor'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.enrolledCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{course.duration || 0}h</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 ml-1">
              {course.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary-600 font-semibold">
            <TrendingUp size={16} />
          </div>
        </div>

        {/* Enroll Button */}
        <button
          className="enroll-btn w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
          onClick={(e) => {
            e.preventDefault();
            onEnroll?.(course.id);
          }}
        >
          Enroll Now
        </button>
      </div>
    </Link>
  );
};
