import { CourseEnrollment, CourseLesson } from '../../api/training.api';
import { CheckCircle2, PlayCircle, Lock } from 'lucide-react';

interface LearningProgressProps {
  enrollment: CourseEnrollment;
  lessons: CourseLesson[];
  completedLessonIds: number[];
  currentLessonId?: number;
  onLessonSelect?: (lessonId: number) => void;
}

export default function LearningProgress({
  enrollment,
  lessons,
  completedLessonIds,
  currentLessonId,
  onLessonSelect
}: LearningProgressProps) {
  const progressPercentage = lessons.length > 0 
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
          <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedLessonIds.length} of {lessons.length} lessons completed
        </p>
      </div>

      {/* Lessons */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 mb-4">Lessons</h4>
        {lessons.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No lessons available</div>
        ) : (
          lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isCurrent = currentLessonId === lesson.id;
            
            return (
              <button
                key={lesson.id}
                onClick={() => onLessonSelect?.(lesson.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-500'
                    : isCompleted
                    ? 'bg-green-50 border-green-200 hover:border-green-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-green-600" />
                    ) : (
                      <PlayCircle size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{lesson.duration} minutes</p>
                  </div>
                  {isCurrent && (
                    <span className="flex-shrink-0 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      Now
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Status */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Status:</span>{' '}
          {enrollment.status === 'COMPLETED' ? (
            <span className="text-green-600 font-semibold">✓ Completed</span>
          ) : enrollment.status === 'IN_PROGRESS' ? (
            <span className="text-blue-600 font-semibold">In Progress</span>
          ) : (
            <span className="text-gray-600">Not Started</span>
          )}
        </p>
        {enrollment.completionDate && (
          <p className="text-xs text-gray-600 mt-2">
            Completed on {new Date(enrollment.completionDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
