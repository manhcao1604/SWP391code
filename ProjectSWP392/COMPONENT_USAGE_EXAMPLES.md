# Frontend Component Usage Examples

Complete examples for using each component in the Employee Training Module.

---

## 1. DashboardStats Component

**File:** `components/training/DashboardStats.tsx`

### What it does:
Displays 4 statistics cards showing:
- Total enrolled courses
- Completed courses
- In-progress courses
- Average rating

### Props:
```typescript
interface DashboardStatsProps {
  data: TrainingDashboard;
}

// TrainingDashboard interface:
{
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageRating: number;
  recentCourses: TrainingCourse[];
  upcomingCourses: TrainingCourse[];
}
```

### Basic Usage:
```tsx
import DashboardStats from '../components/training/DashboardStats';
import { trainingApi } from '../api/training.api';
import { useState, useEffect } from 'react';

export default function MyPage() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await trainingApi.getDashboard(userId);
      setDashboardData(data);
    };
    loadData();
  }, [userId]);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <DashboardStats data={dashboardData} />
  );
}
```

### Visual Output:
```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 📚 Enrolled      │ ✓ Completed      │ ⏳ In Progress    │ ⭐ Avg Rating    │
│     5 Courses    │    2 Courses     │    3 Courses     │      4.5 Stars    │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## 2. CourseCard Component

**File:** `components/training/CourseCard.tsx`

### What it does:
Single course card for displaying in a grid
- Course image/icon
- Title, description
- Duration, instructor, level
- Enroll button

### Props:
```typescript
interface CourseCardProps {
  course: TrainingCourse;
  onEnroll?: (courseId: number) => void;
  isEnrolled?: boolean;
}
```

### Usage Example:
```tsx
import CourseCard from '../components/training/CourseCard';

export default function CourseGrid() {
  const courses = [
    {
      id: 1,
      name: "React Basics",
      description: "Learn React fundamentals",
      duration: 10,
      level: "Beginner",
      instructorName: "John Doe",
      categoryId: 1,
      categoryName: "Web Development",
      status: "ACTIVE"
    }
  ];

  const handleEnroll = (courseId: number) => {
    console.log('Enrolling in course:', courseId);
    // API call here
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard 
          key={course.id}
          course={course}
          onEnroll={handleEnroll}
          isEnrolled={false}
        />
      ))}
    </div>
  );
}
```

### Styling:
- White background with shadow
- Blue gradient image area
- Responsive grid layout
- Blue "Enroll Now" button

---

## 3. CourseList Component

**File:** `components/training/CourseList.tsx`

### What it does:
- Grid of course cards
- Search functionality
- Pagination with "Load More"
- Loading states

### Props:
```typescript
interface CourseListProps {
  categoryFilter?: number;
  onCourseEnroll?: (courseId: number) => void;
}
```

### Usage Example:
```tsx
import CourseList from '../components/training/CourseList';

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleEnroll = async (courseId: number) => {
    try {
      await trainingApi.enrollCourse(userId, courseId);
      alert('Successfully enrolled!');
    } catch (error) {
      alert('Enrollment failed');
    }
  };

  return (
    <div className="p-6">
      <h1>Browse Courses</h1>
      <CourseList 
        categoryFilter={selectedCategory}
        onCourseEnroll={handleEnroll}
      />
    </div>
  );
}
```

### Features:
```
Search Bar: [Search courses...     ] 🔍
─────────────────────────────────────
📦 Course 1  │  📦 Course 2  │  📦 Course 3
📦 Course 4  │  📦 Course 5  │  📦 Course 6
─────────────────────────────────────
        [Load More]
```

---

## 4. CategoryFilter Component

**File:** `components/training/CategoryFilter.tsx`

### What it does:
- List of course categories
- Filter courses by category
- "All Categories" option

### Props:
```typescript
interface CategoryFilterProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategory: number | null;
}
```

### Usage Example:
```tsx
import CategoryFilter from '../components/training/CategoryFilter';
import CourseList from '../components/training/CourseList';
import { useState } from 'react';

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar */}
      <div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      {/* Main Content */}
      <div className="col-span-3">
        <CourseList categoryFilter={selectedCategory} />
      </div>
    </div>
  );
}
```

### Display:
```
┌─────────────────────┐
│ 🏷️  Categories      │
├─────────────────────┤
│ All Categories      │
│ Web Development ✓   │
│ Mobile Apps         │
│ Data Science        │
│ DevOps              │
└─────────────────────┘
```

---

## 5. CourseDetail Component

**File:** `components/training/CourseDetail.tsx`

### What it does:
- Full course page with header
- Course metadata and description
- Expandable chapters with lessons
- Enroll button

### Props:
```typescript
interface CourseDetailProps {
  course: TrainingCourse;
  onEnroll?: () => void;
  isEnrolled?: boolean;
}
```

### Usage Example:
```tsx
import CourseDetail from '../components/training/CourseDetail';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { trainingApi } from '../api/training.api';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      const data = await trainingApi.getCourseDetail(parseInt(courseId));
      setCourse(data);
    };
    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    await trainingApi.enrollCourse(userId, course.id);
    alert('Enrolled successfully!');
  };

  if (!course) return <div>Loading...</div>;

  return (
    <CourseDetail 
      course={course}
      onEnroll={handleEnroll}
      isEnrolled={userEnrolled}
    />
  );
}
```

### Structure:
```
┌─────────────────────────────────────┐
│   [Hero Image - Gradient Header]    │
├─────────────────────────────────────┤
│ 🏷️  Web Development                 │
│                                     │
│ Advanced React Development          │
│ Learn advanced React patterns...    │
│ 👤 John Doe | ⏱️  40 hours | 🎯 Adv│
│                                     │
│ [Enroll Now]                        │
│                                     │
│ 📖 Course Content                   │
│ ✓ Chapter 1: Basics                 │
│   └─ Lesson 1: Introduction         │
│   └─ Lesson 2: Setup                │
│ ► Chapter 2: Advanced               │
│   └─ Lesson 3: Hooks                │
└─────────────────────────────────────┘
```

---

## 6. LearningProgress Component

**File:** `components/training/LearningProgress.tsx`

### What it does:
- Progress bar (percentage)
- Checklist of lessons
- Completion status indicator
- Current lesson highlight

### Props:
```typescript
interface LearningProgressProps {
  enrollment: CourseEnrollment;
  lessons: CourseLesson[];
  completedLessonIds: number[];
  currentLessonId?: number;
  onLessonSelect?: (lessonId: number) => void;
}
```

### Usage Example:
```tsx
import LearningProgress from '../components/training/LearningProgress';
import { useState } from 'react';

export default function LearningPage() {
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [completedIds, setCompletedIds] = useState([]);

  const enrollment = {
    id: 1,
    courseId: 5,
    userId: 10,
    enrollmentDate: new Date().toISOString(),
    status: 'IN_PROGRESS',
    progress: 50,
    completionDate: null
  };

  const lessons = [
    { id: 1, title: "Introduction", duration: 10 },
    { id: 2, title: "Setup", duration: 15 },
    { id: 3, title: "Basics", duration: 20 }
  ];

  return (
    <LearningProgress
      enrollment={enrollment}
      lessons={lessons}
      completedLessonIds={completedIds}
      currentLessonId={currentLessonId}
      onLessonSelect={setCurrentLessonId}
    />
  );
}
```

### Visual:
```
┌──────────────────────────┐
│ Your Progress      50%   │
├──────────────────────────┤
│ ████████████░░░░░░░░░░░ │
│ 2 of 4 lessons completed │
│                          │
│ Lessons:                 │
│ ✓ 1. Introduction    Now │
│ ○ 2. Setup               │
│ ○ 3. Advanced            │
│                          │
│ Status: In Progress      │
└──────────────────────────┘
```

---

## 7. CourseRatingModal Component

**File:** `components/training/CourseRatingModal.tsx`

### What it does:
- Modal dialog for rating courses
- 5-star rating picker
- Comment textarea
- Submit button

### Props:
```typescript
interface CourseRatingModalProps {
  enrollmentId: number;
  courseName: string;
  onClose: () => void;
  onSuccess?: () => void;
}
```

### Usage Example:
```tsx
import CourseRatingModal from '../components/training/CourseRatingModal';
import { useState } from 'react';

export default function CoursePage() {
  const [showRatingModal, setShowRatingModal] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setShowRatingModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Rate Course
      </button>

      {showRatingModal && (
        <CourseRatingModal
          enrollmentId={123}
          courseName="React Basics"
          onClose={() => setShowRatingModal(false)}
          onSuccess={() => {
            alert('Rating submitted!');
            setShowRatingModal(false);
          }}
        />
      )}
    </div>
  );
}
```

### Modal Layout:
```
┌───────────────────────────────────────┐
│ Rate This Course              [X]     │
├───────────────────────────────────────┤
│ Course: React Basics                  │
│                                       │
│ Rate this course:                     │
│  ⭐  ⭐  ⭐  ⭐  ⭐  (5 of 5 stars)    │
│                                       │
│ Share your feedback:                  │
│ [Great course, very helpful!        ] │
│ [                                   ] │
│                                       │
│ [Cancel]  [Submit Rating]             │
└───────────────────────────────────────┘
```

---

## 8. MyEnrollments Component

**File:** `components/training/MyEnrollments.tsx`

### What it does:
- List of user's enrolled courses
- Filter tabs (All, In Progress, Completed)
- Progress bar per course
- Course metadata

### Props:
```typescript
interface MyEnrollmentsProps {
  userId: number;
  onCourseSelect?: (enrollmentId: number) => void;
}
```

### Usage Example:
```tsx
import MyEnrollments from '../components/training/MyEnrollments';
import { useAuthStore } from '../stores/auth.store';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const handleSelectCourse = (enrollmentId: number) => {
    // Navigate to learning page
    window.location.href = `/learning/${enrollmentId}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      
      <MyEnrollments
        userId={user.id}
        onCourseSelect={handleSelectCourse}
      />
    </div>
  );
}
```

### Tabs Display:
```
┌──────────────────────────────────────┐
│ All (5)  │ In Progress (3)  │ Done (2)│
├──────────────────────────────────────┤
│ Course 1: React Basics        50%    │
│ ████████████░░░░░░░░░░░░░░░░░░░░░░  │
│ Enrolled: Jan 15 | Status: In Progress
│                                      │
│ Course 2: Node.js Advanced   100%    │
│ ████████████████████████████████████ │
│ Enrolled: Dec 1 | Completed: Jan 20  │
│                                      │
│ Course 3: Docker Basics       25%    │
│ ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ Enrolled: Jan 22 | Status: In Progress
└──────────────────────────────────────┘
```

---

## Complete Page Example

Combining multiple components into one full page:

```tsx
// pages/TrainingDashboard.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import DashboardStats from '../components/training/DashboardStats';
import MyEnrollments from '../components/training/MyEnrollments';
import { trainingApi } from '../api/training.api';

export default function TrainingDashboard() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await trainingApi.getDashboard(user.id);
      setDashboard(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>Error loading dashboard</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Learning Dashboard</h1>
      
      {/* Stats Section */}
      <DashboardStats data={dashboard} />
      
      {/* Enrollments Section */}
      <div className="mt-12">
        <MyEnrollments userId={user.id} />
      </div>
    </div>
  );
}
```

---

## API Integration Pattern

All components follow this pattern for API calls:

```tsx
import { useState, useEffect } from 'react';
import { trainingApi } from '../api/training.api';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingApi.getEndpoint();
      setData(response);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No data</div>;

  return <div>{/* Component JSX */}</div>;
}
```

---

## Tips & Best Practices

1. **Always handle loading states** - Users should know when data is being fetched
2. **Show error messages** - Help users understand what went wrong
3. **Use semantic HTML** - Improves accessibility
4. **Follow Tailwind conventions** - Consistent styling across app
5. **Test with real data** - Components work best with actual backend data
6. **Check console for errors** - F12 → Console tab in browser

---

**Happy coding! 🚀**
