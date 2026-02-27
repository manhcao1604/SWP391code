import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import LearningProgress from '../components/training/LearningProgress';
import CourseRatingModal from '../components/training/CourseRatingModal';
import { CourseEnrollment, CourseLesson, trainingApi } from '../api/training.api';
import { Play, CheckCircle2, MessageSquare } from 'lucide-react';

export default function CourseLearning() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { user } = useAuthStore();
  
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    if (enrollmentId) {
      loadEnrollmentData();
    }
  }, [enrollmentId]);

  const loadEnrollmentData = async () => {
    if (!enrollmentId) return;

    try {
      setLoading(true);
      
      // Load enrollment details
      const enrollmentData = await trainingApi.getEnrollmentDetail(parseInt(enrollmentId));
      setEnrollment(enrollmentData);

      // Load lessons (would need course ID from enrollment)
      // For now, this is a placeholder
      // const lessonsData = await trainingApi.getLessonsByChapter(enrollmentData.courseId);
      // setLessons(lessonsData);

      // Load completions
      const completions = await trainingApi.getCompletions(parseInt(enrollmentId));
      setCompletedLessonIds(completions.map(c => c.lessonId));
    } catch (error) {
      console.error('Failed to load enrollment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!enrollmentId || !currentLesson) return;

    try {
      await trainingApi.completeLesson(parseInt(enrollmentId), currentLesson.id);
      setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const handleRateCourse = () => {
    if (enrollment?.status === 'COMPLETED') {
      setShowRatingModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading course...</div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load enrollment. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Video Player Area */}
              <div className="bg-gray-900 aspect-video flex items-center justify-center">
                {currentLesson?.videoUrl ? (
                  <video 
                    src={currentLesson.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center">
                    <Play size={64} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {currentLesson 
                        ? 'Video not available for this lesson'
                        : 'Select a lesson to start learning'}
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Content */}
              {currentLesson && (
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentLesson.title}
                  </h1>
                  
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {currentLesson.content}
                    </p>
                  </div>

                  {/* Complete Lesson Button */}
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completedLessonIds.includes(currentLesson.id)}
                    className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                      completedLessonIds.includes(currentLesson.id)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {completedLessonIds.includes(currentLesson.id) ? (
                      <>
                        <CheckCircle2 size={20} />
                        Lesson Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>

                  {/* Complete Course Rating Button */}
                  {enrollment.status === 'COMPLETED' && (
                    <button
                      onClick={handleRateCourse}
                      className="mt-4 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    >
                      <MessageSquare size={20} />
                      Rate This Course
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LearningProgress
              enrollment={enrollment}
              lessons={lessons}
              completedLessonIds={completedLessonIds}
              currentLessonId={currentLesson?.id}
              onLessonSelect={setCurrentLesson}
            />
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <CourseRatingModal
          enrollmentId={parseInt(enrollmentId || '0')}
          courseName={`Course #${enrollment.courseId}`}
          onClose={() => setShowRatingModal(false)}
          onSuccess={() => {
            alert('Thank you for rating this course!');
            setShowRatingModal(false);
          }}
        />
      )}
    </div>
  );
}
