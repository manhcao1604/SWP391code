# Employee Training System - Frontend

A modern, responsive React/TypeScript frontend for the Employee Training Management System.

## 📋 Quick Start (3 Steps)

### Step 1: Clone/Copy the Project
Copy the `EmployeeTrainingFrontend` folder to your machine.

### Step 2: Install Dependencies
```bash
cd EmployeeTrainingFrontend
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

---

## 🎯 Project Structure

```
EmployeeTrainingFrontend/
├── src/
│   ├── api/               # API client & types
│   │   └── trainingApi.ts
│   ├── components/        # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── CourseCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Browse.tsx
│   │   └── CourseDetail.tsx
│   ├── store/            # State management (Zustand)
│   │   └── trainingStore.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
└── vite.config.ts        # Vite config
```

---

## 🚀 Available Pages

### 1. Dashboard (`/dashboard`)
- View learning statistics
- See enrolled courses
- Track progress
- Quick stats cards

### 2. Browse Courses (`/browse`)
- Search courses
- Filter by category
- View course cards
- Enroll in courses

### 3. Course Detail (`/course/:id`)
- Full course information
- View chapters & lessons
- Track completion
- Course metadata

---

## 🔌 Backend Connection

The frontend expects backend API at: `http://localhost:8080`

### Configure Backend URL
Edit `.env` or `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide Icons** - Icons

---

## 📝 Component Documentation

### CourseCard
Displays individual course information in a card format.
```typescript
<CourseCard 
  course={course} 
  onEnroll={(id) => handleEnroll(id)} 
/>
```

### StatsCard
Shows statistics with icon and value.
```typescript
<StatsCard 
  title="Courses" 
  value={5} 
  icon={<BookIcon />} 
  color="blue"
/>
```

### Navbar
Navigation bar with router links.
```typescript
<Navbar /> // Auto-handles active state
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Employee Training System
VITE_APP_VERSION=1.0.0
```

---

## 🐛 Debugging

Enable debugging in console:
```javascript
// Check store state
import { useTrainingStore } from './store/trainingStore';
const state = useTrainingStore();
console.log(state);
```

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Hamburger menu on mobile
- Optimized for all screen sizes

---

## 🎨 Styling

All styles use Tailwind CSS. Customize in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles
- Inline classes in components

---

## ⚠️ Common Issues

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### API Connection Error
Check that backend is running on `http://localhost:8080`

### CSS Not Loading
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

---

## 📄 License

Internal Project - Not for public distribution

---

## 👥 Team

Developed for internal training system

---

## 🎉 Happy Coding!

For issues or questions, contact the development team.
