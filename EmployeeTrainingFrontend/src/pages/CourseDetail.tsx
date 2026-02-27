import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, CheckCircle, Play } from 'lucide-react';
import { trainingApi, CourseDetail as CourseDetailType } from '../api/trainingApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const res = await trainingApi.getCourseDetail(parseInt(id));
        setCourse(res.data);
      } catch (err) {
        setError('Failed to load course');
        console.error('[v0] Course detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{error || 'Course not found'}</p>
          <Link
            to="/browse"
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/browse"
            className="text-primary-100 hover:text-white mb-4 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
          <p className="text-primary-100 text-lg">{course.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2">
            {/* Thumbnail */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={course.thumbnail || 'https://via.placeholder.com/700x400?text=Course'}
                alt={course.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Chapters Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {chapter.lessons.length} lessons
                        </p>
                      </div>
                      <Play size={20} className="text-primary-600" />
                    </div>

                    {/* Lessons */}
                    <div className="mt-4 space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 text-sm text-gray-600 ml-4"
                        >
                          {lesson.isCompleted ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                          <span>{lesson.title}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {lesson.duration}min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{course.duration} hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Enrolled</p>
                    <p className="font-semibold text-gray-900">
                      {course.enrolledCount} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold text-gray-900">
                      {course.rating.toFixed(1)}/5
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* Progress */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (course.completedLessons / course.totalLessons) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {course.completedLessons}/{course.totalLessons} lessons completed
                </p>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  course.isEnrolled
                    ? 'bg-success-500 text-white hover:bg-success-600'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {course.isEnrolled ? 'Continue Learning' : 'Enroll Now'}
              </button>

              {/* Instructor */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Instructor</p>
                <p className="font-semibold text-gray-900">{course.instructor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
