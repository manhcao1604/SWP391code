# Frontend Setup Guide - Employee Training Module

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Project Structure](#project-structure)
5. [Component Guide](#component-guide)
6. [Running the Application](#running-the-application)
7. [API Configuration](#api-configuration)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a **React + TypeScript** frontend application for the Employee Training Management System built with:
- **React 19.2** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management
- **Lucide React** - Icons

### Key Features
✅ Browse and search training courses  
✅ Enroll in courses  
✅ Track learning progress  
✅ View course content and lessons  
✅ Rate and review courses  
✅ Dashboard with statistics  
✅ My Enrollments management  

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **npm or yarn** (comes with Node.js)
   ```bash
   npm --version
   # or
   yarn --version
   ```

3. **Git** (for version control)
   ```bash
   git --version
   ```

4. **Visual Studio Code** (recommended IDE)
   - Download from: https://code.visualstudio.com/

5. **Backend API Running**
   - Make sure your Java Spring Boot backend is running on `http://localhost:8080`
   - Database should be set up with training tables

---

## Installation Steps

### Step 1: Navigate to Frontend Directory

```bash
cd ProjectSWP392/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

**Time**: 2-5 minutes depending on internet speed

### Step 3: Configure Environment Variables (if needed)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=ITMS Training
```

Or update `frontend/src/api/training.api.ts` with your backend URL.

### Step 4: Start Development Server

```bash
npm run dev
```

**Output should look like:**
```
  VITE v7.2.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Open in Browser

Click the link or paste in your browser:
```
http://localhost:5173/
```

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── auth.api.ts          # Authentication API calls
│   │   ├── training.api.ts      # Training API calls (NEW)
│   │   └── index.ts             # API exports
│   │
│   ├── components/
│   │   ├── training/            # NEW Training Components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── CourseList.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── LearningProgress.tsx
│   │   │   ├── MyEnrollments.tsx
│   │   │   └── CourseRatingModal.tsx
│   │   └── ... (other components)
│   │
│   ├── pages/
│   │   ├── TrainingBrowse.tsx      # NEW Browse Courses Page
│   │   ├── TrainingDashboard.tsx   # NEW Dashboard Page
│   │   ├── CourseLearning.tsx      # NEW Learning Page
│   │   └── ... (other pages)
│   │
│   ├── stores/
│   │   └── auth.store.ts           # Zustand auth state
│   │
│   ├── lib/
│   │   └── axios.ts                # Axios configuration
│   │
│   ├── App.tsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
│
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── eslint.config.js                 # ESLint config
```

---

## Component Guide

### 🎨 New Components Created

#### 1. **CourseCard.tsx**
Displays individual course in a grid format
- Shows course title, description, duration, instructor
- Enroll button
- Category badge

**Usage:**
```tsx
<CourseCard 
  course={course}
  onEnroll={handleEnroll}
  isEnrolled={isEnrolled}
/>
```

#### 2. **CourseList.tsx**
Shows grid of courses with search and filtering
- Search functionality
- Pagination
- Loading states

**Usage:**
```tsx
<CourseList 
  categoryFilter={categoryId}
  onCourseEnroll={handleEnroll}
/>
```

#### 3. **DashboardStats.tsx**
Displays 4 stat cards: enrolled, completed, in-progress, rating
- Animated stat cards
- Icons for each stat

**Usage:**
```tsx
<DashboardStats data={dashboardData} />
```

#### 4. **CourseDetail.tsx**
Full course details with chapters and lessons
- Course image and metadata
- Chapter accordion
- Lesson listing

**Usage:**
```tsx
<CourseDetail 
  course={course}
  onEnroll={handleEnroll}
  isEnrolled={isEnrolled}
/>
```

#### 5. **LearningProgress.tsx**
Shows progress bar and lesson checklist
- Progress percentage
- Lesson completion status
- Current lesson indicator

**Usage:**
```tsx
<LearningProgress
  enrollment={enrollment}
  lessons={lessons}
  completedLessonIds={[1, 2, 3]}
  currentLessonId={4}
  onLessonSelect={handleSelect}
/>
```

#### 6. **CourseRatingModal.tsx**
Modal for rating and reviewing courses
- 5-star rating system
- Comment textarea
- Submit button

**Usage:**
```tsx
{showModal && (
  <CourseRatingModal
    enrollmentId={enrollmentId}
    courseName="React Basics"
    onClose={handleClose}
    onSuccess={handleSuccess}
  />
)}
```

#### 7. **CategoryFilter.tsx**
Sidebar filter for course categories
- Load categories from API
- Select/filter by category

**Usage:**
```tsx
<CategoryFilter
  selectedCategory={selected}
  onCategorySelect={handleSelect}
/>
```

#### 8. **MyEnrollments.tsx**
List of user's enrolled courses
- Filter by status (all, in-progress, completed)
- Progress bar per course
- Course metadata

**Usage:**
```tsx
<MyEnrollments 
  userId={userId}
  onCourseSelect={handleSelect}
/>
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- Auto-reload on file changes
- Source maps for debugging
- Development warnings

### Build for Production

```bash
npm run build
```

- Optimizes code
- Minifies assets
- Creates `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

Checks TypeScript without emitting code.

### Linting

```bash
npm run lint
```

Checks code style with ESLint.

---

## API Configuration

### Base URL Configuration

Edit `src/api/training.api.ts`:

```typescript
const API_URL = 'http://localhost:8080/api/training';
```

### API Endpoints Available

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/training/dashboard/{userId}` | Get dashboard stats |
| GET | `/api/training/courses` | Get all courses |
| GET | `/api/training/courses/{id}` | Get course detail |
| GET | `/api/training/categories` | Get categories |
| POST | `/api/training/enrollments` | Enroll in course |
| GET | `/api/training/enrollments/user/{userId}` | Get user's enrollments |
| POST | `/api/training/completions` | Mark lesson complete |
| POST | `/api/training/ratings` | Rate a course |

### Testing API Calls

```bash
# Test if backend is running
curl http://localhost:8080/api/training/categories

# Should return: [{"id":1,"name":"..."}]
```

---

## Routing Setup

### Add Routes to App.tsx

```tsx
import TrainingBrowse from './pages/TrainingBrowse';
import TrainingDashboard from './pages/TrainingDashboard';
import CourseLearning from './pages/CourseLearning';

// In your routes:
<Route path="/training/browse" element={<TrainingBrowse />} />
<Route path="/training/dashboard" element={<TrainingDashboard />} />
<Route path="/training/learning/:enrollmentId" element={<CourseLearning />} />
```

---

## Styling with Tailwind

All components use **Tailwind CSS** utility classes. No custom CSS needed.

### Common Classes Used
- `bg-blue-600` - Blue background
- `text-white` - White text
- `rounded-lg` - Rounded corners
- `shadow` - Shadow effect
- `hover:` - Hover state
- `grid grid-cols-3` - 3-column grid
- `flex items-center` - Flexbox centering

See [Tailwind Documentation](https://tailwindcss.com/docs)

---

## Debugging

### 1. Check Browser Console
- Press `F12` to open DevTools
- Go to Console tab
- Look for red error messages

### 2. Check Network Requests
- Open DevTools → Network tab
- Perform an action (enroll course)
- Click on the API request
- Check Status (should be 200) and Response

### 3. Common Issues

**Issue: "Cannot reach API"**
- Ensure backend is running on port 8080
- Check API_URL in `training.api.ts`
- Check firewall/proxy settings

**Issue: "Module not found"**
- Run `npm install` again
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` fresh

**Issue: "Port 5173 already in use"**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

---

## VS Code Extensions (Recommended)

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **TypeScript Vue Plugin** - Vue.volar
4. **Prettier** - esbenp.prettier-vscode
5. **ESLint** - dbaeumer.vscode-eslint

Install extensions: Open VS Code → Extensions → Search and Install

---

## Performance Tips

1. **Use React DevTools** - Chrome extension for component debugging
2. **Code Splitting** - Lazy load pages with `React.lazy()`
3. **Image Optimization** - Use appropriate image sizes
4. **API Caching** - Implemented with Zustand store

---

## Next Steps

1. ✅ Start dev server (`npm run dev`)
2. ✅ Login with your credentials
3. ✅ Navigate to Training → Browse Courses
4. ✅ Enroll in a course
5. ✅ View progress on Dashboard
6. ✅ Rate the course

---

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Check backend logs (Java terminal)
3. Verify database connection
4. Review this guide again

---

**Good luck with your training platform! 🚀**
