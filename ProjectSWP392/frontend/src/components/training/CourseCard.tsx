import { TrainingCourse } from '../../api/training.api';
import { Clock, User, Star, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: TrainingCourse;
  onEnroll?: (courseId: number) => void;
  isEnrolled?: boolean;
}

export default function CourseCard({ course, onEnroll, isEnrolled }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      {/* Image */}
      {course.imageUrl && (
        <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
          <img 
            src={course.imageUrl} 
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {course.categoryName || 'General'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {course.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{course.duration} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{course.instructorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400" />
            <span>{course.level}</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onEnroll?.(course.id)}
          disabled={isEnrolled}
          className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            isEnrolled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
          {!isEnrolled && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
