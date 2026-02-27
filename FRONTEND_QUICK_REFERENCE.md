# Frontend Quick Reference Guide

## 🚀 30-Second Setup

```bash
cd ProjectSWP392/frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📁 File Locations

### Components (Copy-paste ready)
```
frontend/src/components/training/
├── CourseCard.tsx          ← Individual course
├── CourseList.tsx          ← Grid of courses  
├── DashboardStats.tsx      ← 4 stat cards
├── CourseDetail.tsx        ← Full course page
├── LearningProgress.tsx    ← Progress tracker
├── CourseRatingModal.tsx   ← Rating dialog
├── CategoryFilter.tsx      ← Filter sidebar
└── MyEnrollments.tsx       ← User courses
```

### Pages (Route-ready)
```
frontend/src/pages/
├── TrainingBrowse.tsx      → /training/browse
├── TrainingDashboard.tsx   → /training/dashboard
└── CourseLearning.tsx      → /training/learning/:id
```

### API
```
frontend/src/api/
└── training.api.ts         ← All API endpoints
```

---

## 🔗 API Endpoints Cheatsheet

### Get Data
```typescript
// Get dashboard stats
const stats = await trainingApi.getDashboard(userId);

// Get all courses
const courses = await trainingApi.getAllCourses(page, size);

// Get by category
const catCourses = await trainingApi.getCoursesByCategory(categoryId);

// Search courses
const results = await trainingApi.searchCourses("React", page, size);

// Get course detail
const course = await trainingApi.getCourseDetail(courseId);

// Get categories
const categories = await trainingApi.getCategories();

// Get user enrollments
const enrollments = await trainingApi.getEnrollments(userId);

// Get lessons by chapter
const lessons = await trainingApi.getLessonsByChapter(chapterId);
```

### Post Data
```typescript
// Enroll in course
await trainingApi.enrollCourse(userId, courseId);

// Mark lesson complete
await trainingApi.completeLesson(enrollmentId, lessonId);

// Rate course
await trainingApi.rateCourse(enrollmentId, rating, comment);
```

---

## 📦 Component Props Quick Ref

### CourseCard
```tsx
<CourseCard 
  course={TrainingCourse}
  onEnroll={(id) => {}}
  isEnrolled={false}
/>
```

### CourseList
```tsx
<CourseList 
  categoryFilter={1}
  onCourseEnroll={(id) => {}}
/>
```

### DashboardStats
```tsx
<DashboardStats 
  data={TrainingDashboard}
/>
```

### CourseDetail
```tsx
<CourseDetail 
  course={TrainingCourse}
  onEnroll={() => {}}
  isEnrolled={false}
/>
```

### LearningProgress
```tsx
<LearningProgress
  enrollment={CourseEnrollment}
  lessons={CourseLesson[]}
  completedLessonIds={[1, 2, 3]}
  currentLessonId={4}
  onLessonSelect={(id) => {}}
/>
```

### CourseRatingModal
```tsx
<CourseRatingModal
  enrollmentId={123}
  courseName="React Basics"
  onClose={() => {}}
  onSuccess={() => {}}
/>
```

### CategoryFilter
```tsx
<CategoryFilter
  selectedCategory={1}
  onCategorySelect={(id) => {}}
/>
```

### MyEnrollments
```tsx
<MyEnrollments
  userId={10}
  onCourseSelect={(id) => {}}
/>
```

---

## 🎨 Tailwind Classes Cheatsheet

```tsx
// Layout
grid grid-cols-3          // 3-column grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Responsive
flex items-center justify-between     // Flex centering
gap-6                     // Spacing between items

// Colors
bg-blue-600               // Background
text-white               // Text
text-gray-500            // Gray text
border-blue-300          // Border

// Sizing & Spacing
w-full                   // 100% width
p-6                      // Padding
px-4 py-2               // Horizontal & vertical
mx-auto                  // Center horizontally
mb-4                     // Margin bottom

// Shadows & Borders
shadow                   // Box shadow
shadow-lg               // Larger shadow
rounded-lg              // Rounded corners
border                  // 1px border

// States & Effects
hover:bg-blue-700       // Hover effect
disabled:opacity-50     // Disabled state
transition-all          // Smooth animation
cursor-pointer          // Clickable cursor

// Typography
font-bold               // Bold text
text-lg                 // Large text
text-xs                 // Small text
text-balance            // Good line breaks
```

---

## 🔄 Common Patterns

### Loading State
```tsx
const [loading, setLoading] = useState(false);

if (loading) return <div>Loading...</div>;
```

### Error Handling
```tsx
try {
  const data = await trainingApi.getCourses();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  alert('Failed to load data');
}
```

### useEffect with Cleanup
```tsx
useEffect(() => {
  loadData();
  return () => {
    // Cleanup if needed
  };
}, [dependency]);
```

### Conditional Rendering
```tsx
{loading ? (
  <div>Loading...</div>
) : error ? (
  <div>Error: {error}</div>
) : (
  <div>{data}</div>
)}
```

---

## 🧪 Testing Components

### Test CourseCard
```tsx
import CourseCard from '../components/training/CourseCard';

// Inside your component:
<CourseCard
  course={{
    id: 1,
    name: "React Basics",
    description: "Learn React",
    duration: 10,
    level: "Beginner",
    instructorName: "John",
    categoryId: 1,
    status: "ACTIVE"
  }}
  onEnroll={(id) => console.log('Enrolled:', id)}
/>
```

### Test CourseList
```tsx
import CourseList from '../components/training/CourseList';

<CourseList 
  categoryFilter={null}
  onCourseEnroll={(id) => console.log('Enrolled:', id)}
/>
```

### Test DashboardStats
```tsx
import DashboardStats from '../components/training/DashboardStats';

<DashboardStats
  data={{
    totalEnrolledCourses: 5,
    completedCourses: 2,
    inProgressCourses: 3,
    averageRating: 4.5,
    recentCourses: [],
    upcomingCourses: []
  }}
/>
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot reach API"
```typescript
// Check in training.api.ts:
const API_URL = 'http://localhost:8080/api/training';
// Make sure backend is running on port 8080
```

### Issue: "Module not found"
```bash
# Reinstall dependencies:
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5173 already in use"
```bash
# Kill process using the port:
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: "Components not rendering"
- Check browser console (F12)
- Verify all imports are correct
- Ensure data is being passed correctly
- Check API responses in Network tab

---

## 📊 Component Hierarchy

```
App
├── TrainingBrowse
│   ├── CategoryFilter
│   └── CourseList
│       └── CourseCard (x12)
│
├── TrainingDashboard
│   ├── DashboardStats
│   └── MyEnrollments
│       └── Enrollment Item (xN)
│
└── CourseLearning
    ├── CourseDetail
    └── LearningProgress
```

---

## 🎯 Routes Setup

Add to your `App.tsx`:

```tsx
import TrainingBrowse from './pages/TrainingBrowse';
import TrainingDashboard from './pages/TrainingDashboard';
import CourseLearning from './pages/CourseLearning';

// In your Routes:
<Route path="/training/browse" element={<TrainingBrowse />} />
<Route path="/training/dashboard" element={<TrainingDashboard />} />
<Route path="/training/learning/:enrollmentId" element={<CourseLearning />} />
```

---

## 🔐 Auth Integration

Using Zustand store (already set up):

```tsx
import { useAuthStore } from '../stores/auth.store';

export default function MyComponent() {
  const { user } = useAuthStore();
  
  return (
    <div>
      Welcome, {user?.email}!
      <MyEnrollments userId={user?.id || 0} />
    </div>
  );
}
```

---

## 💾 TypeScript Interfaces

### Main Models
```typescript
interface TrainingCourse {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  duration: number;
  level: string;
  instructorName: string;
}

interface CourseEnrollment {
  id: number;
  courseId: number;
  userId: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
}

interface TrainingDashboard {
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageRating: number;
}
```

---

## 🎨 Styling Quick Tips

### Mobile-First Responsive
```tsx
// Mobile by default, then override
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Means: 1 col on mobile, 2 on tablet, 3 on desktop
```

### Consistent Colors
```tsx
// Primary
bg-blue-600    text-blue-600    border-blue-300

// Success
bg-green-100   text-green-600   border-green-200

// Warning/Info
bg-yellow-100  text-yellow-600  border-yellow-200

// Neutral
bg-gray-100    text-gray-600    border-gray-200
```

### Common Spacing
```tsx
gap-4         // Between items
p-4          // Inside padding
px-4 py-2    // Horizontal-Vertical
mx-auto      // Center
mb-6         // Bottom margin
```

---

## 🔥 Performance Tips

1. **Use React.memo for expensive components**
   ```tsx
   export default React.memo(CourseCard);
   ```

2. **Lazy load pages**
   ```tsx
   const TrainingBrowse = React.lazy(() => import('./pages/TrainingBrowse'));
   ```

3. **Optimize images**
   ```tsx
   <img src={image} alt="description" loading="lazy" />
   ```

4. **Use keys in lists**
   ```tsx
   {items.map(item => <Component key={item.id} ... />)}
   ```

---

## 📱 Browser DevTools Shortcuts

| Shortcut | Action |
|----------|--------|
| F12 | Open DevTools |
| Ctrl+Shift+J | Console |
| Ctrl+Shift+K | Network |
| Ctrl+Shift+I | Inspector |
| Ctrl+Shift+C | Select Element |

---

## 🎓 Learning Path

1. **Day 1**: Setup & run app
2. **Day 2**: Understand component structure
3. **Day 3**: Integrate with backend
4. **Day 4**: Customize styling
5. **Day 5**: Deploy to production

---

## 📖 Quick Links

- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://typescriptlang.org)
- [Vite Docs](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

---

## ✅ Before Going Live

- [ ] API URL is correct
- [ ] All components render without errors
- [ ] Data loads from backend
- [ ] Enrollment works
- [ ] Progress tracking works
- [ ] Rating/review works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Build passes: `npm run build`

---

## 🆘 Need Help?

1. **Check documentation files:**
   - FRONTEND_SETUP_GUIDE.md
   - COMPONENT_USAGE_EXAMPLES.md

2. **Debug with DevTools:**
   - Open F12 → Console/Network
   - Check for API errors

3. **Common issues:**
   - See "Common Issues & Fixes" section

4. **Still stuck?**
   - Re-read setup guide
   - Check backend logs
   - Verify database has test data

---

**You've got this! Happy coding! 🚀**
