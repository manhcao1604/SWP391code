import { useState, useEffect } from 'react';
import { TrainingCourse, CourseChapter, trainingApi } from '../../api/training.api';
import { ChevronDown, Users, Globe, Award, Clock } from 'lucide-react';

interface CourseDetailProps {
  course: TrainingCourse;
  onEnroll?: () => void;
  isEnrolled?: boolean;
}

export default function CourseDetail({ course, onEnroll, isEnrolled }: CourseDetailProps) {
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChapters();
  }, [course.id]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const data = await trainingApi.getChaptersByCourse(course.id);
      setChapters(data);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Image */}
      <div className="relative w-full h-80 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-center">
            <Globe size={48} className="mx-auto mb-4" />
            <p className="text-2xl font-bold">{course.name}</p>
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Title and Meta */}
        <div className="mb-8">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            {course.categoryName}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.name}</h1>
          
          <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>{course.instructorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span>{course.level}</span>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {course.description}
          </p>

          {/* Enroll Button */}
          <button
            onClick={onEnroll}
            disabled={isEnrolled}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              isEnrolled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isEnrolled ? '✓ Already Enrolled' : 'Enroll Now'}
          </button>
        </div>

        {/* Chapters Section */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
          
          {loading ? (
            <div className="text-gray-500">Loading chapters...</div>
          ) : chapters.length === 0 ? (
            <div className="text-gray-500">No chapters available</div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <ChapterAccordion
                  key={chapter.id}
                  chapter={chapter}
                  isExpanded={expandedChapter === chapter.id}
                  onToggle={() => setExpandedChapter(
                    expandedChapter === chapter.id ? null : chapter.id
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterAccordion({ 
  chapter, 
  isExpanded, 
  onToggle 
}: { 
  chapter: CourseChapter;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLessons = async () => {
    if (isExpanded) {
      try {
        setLoading(true);
        const data = await trainingApi.getLessonsByChapter(chapter.id);
        setLessons(data);
      } catch (error) {
        console.error('Failed to load lessons:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isExpanded) {
      loadLessons();
    }
  }, [isExpanded]);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          {loading ? (
            <div className="text-gray-500">Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div className="text-gray-500">No lessons in this chapter</div>
          ) : (
            <ul className="space-y-3">
              {lessons.map((lesson, index) => (
                <li key={lesson.id} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{lesson.duration} mins</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
