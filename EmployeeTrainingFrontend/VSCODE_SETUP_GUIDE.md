# Visual Studio Code Setup Guide

Complete step-by-step guide to run the Employee Training Frontend in VS Code.

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)

---

## 🔍 Check Prerequisites

Open Terminal/PowerShell and verify:

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version
```

If not installed, install Node.js from https://nodejs.org/

---

## 📂 Step 1: Open Project in VS Code

### Option A: Open Existing Folder
1. Open VS Code
2. `File` → `Open Folder...`
3. Navigate to `EmployeeTrainingFrontend` folder
4. Click `Select Folder`

### Option B: Using Terminal
```bash
# Navigate to project folder
cd path/to/EmployeeTrainingFrontend

# Open in VS Code
code .
```

---

## 💾 Step 2: Install Dependencies

### Method 1: Terminal in VS Code (Recommended)
1. Open Terminal in VS Code:
   - `Ctrl + ~` (Windows/Linux)
   - `Cmd + ~` (Mac)

2. Run command:
```bash
npm install
```

Wait for installation to complete (1-2 minutes).

### Method 2: PowerShell/Terminal Outside VS Code
```bash
cd EmployeeTrainingFrontend
npm install
```

---

## ✅ Verify Installation

Check that `node_modules` folder was created:

```bash
# List folders
ls -la

# Should see: node_modules/ folder
```

---

## 🚀 Step 3: Start Development Server

In VS Code Terminal, run:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## 🌐 Step 4: Open in Browser

Click the link in terminal or open browser:

```
http://localhost:5173
```

You should see the **Employee Training System** dashboard!

---

## 🛑 Stop Server

In Terminal, press: `Ctrl + C`

---

## 🔄 Common Tasks

### Hot Reload (Auto-refresh)
Changes save automatically! No need to restart.

- Edit any file in `src/`
- Browser auto-refreshes
- See changes immediately

### Rebuild
If changes don't show:
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 🔧 VS Code Extensions (Optional)

Recommended extensions for better development:

### Install Extensions
1. Open Extensions panel: `Ctrl + Shift + X`
2. Search and install:

| Extension | Publisher | Purpose |
|-----------|-----------|---------|
| **ES7+ React/Redux/React-Native snippets** | dsznajder | React snippets |
| **Tailwind CSS IntelliSense** | bradlc | Tailwind autocomplete |
| **TypeScript Vue Plugin** | Vue | TypeScript support |
| **Prettier** | esbenp | Code formatter |
| **ESLint** | microsoft | Code linting |

---

## 🎨 Configure Environment

### Create `.env.local` file

1. In VS Code, right-click `EmployeeTrainingFrontend` folder
2. Select `New File`
3. Name it `.env.local`
4. Add content:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Employee Training System
VITE_APP_VERSION=1.0.0
```

5. Save (Ctrl + S)

---

## 📁 Project File Structure

```
EmployeeTrainingFrontend/
├── src/
│   ├── api/
│   │   └── trainingApi.ts      (API calls)
│   ├── components/
│   │   ├── Navbar.tsx          (Navigation bar)
│   │   ├── CourseCard.tsx       (Course card)
│   │   ├── StatsCard.tsx        (Stats display)
│   │   └── LoadingSpinner.tsx   (Loading state)
│   ├── pages/
│   │   ├── Dashboard.tsx        (Main dashboard)
│   │   ├── Browse.tsx           (Course browser)
│   │   └── CourseDetail.tsx     (Course details)
│   ├── store/
│   │   └── trainingStore.ts     (State management)
│   ├── App.tsx                  (Main app)
│   ├── main.tsx                 (Entry point)
│   └── index.css                (Global styles)
├── public/                       (Static files)
├── index.html                    (HTML template)
├── package.json                  (Dependencies)
├── vite.config.ts                (Build config)
├── tsconfig.json                 (TypeScript config)
├── tailwind.config.js            (Tailwind config)
└── README.md                      (This file)
```

---

## 🔗 Connected Backend

The frontend connects to backend API at:
```
http://localhost:8080
```

### Ensure Backend is Running

Before running frontend:
1. Start your Spring Boot backend
2. Verify it's on port 8080
3. Check database is running

---

## 📝 Edit and View Changes

### Example: Edit Dashboard Title

1. Open `src/pages/Dashboard.tsx`
2. Find line with `Welcome Back!`
3. Change to `Welcome to Training!`
4. Save (Ctrl + S)
5. Browser auto-refreshes!

---

## 🐛 Troubleshooting

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Use different port
npm run dev -- --port 3000

# Then open http://localhost:3000
```

### Issue: `npm: command not found`

**Solution:**
- Node.js not installed properly
- Restart computer after installation
- Add Node.js to PATH

### Issue: White blank page

**Solution:**
- Check browser console (F12)
- Check Terminal for errors
- Restart server: `npm run dev`

### Issue: Cannot connect to backend

**Solution:**
- Verify backend is running on port 8080
- Check `.env.local` configuration
- Check network in browser DevTools

### Issue: Slow hot reload

**Solution:**
```bash
# Stop server
Ctrl + C

# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

---

## 📚 Component Usage Examples

### Using Dashboard Component

```typescript
import { Dashboard } from './pages/Dashboard';

// Automatically loads data on mount
<Dashboard />
```

### Using Browse Page

```typescript
import { Browse } from './pages/Browse';

// Shows all courses with filters
<Browse />
```

### Using CourseCard

```typescript
import { CourseCard } from './components/CourseCard';

<CourseCard 
  course={courseData}
  onEnroll={(id) => console.log('Enroll:', id)}
/>
```

---

## 🎯 Development Workflow

### 1. Make Code Changes
Edit files in `src/` folder

### 2. Auto Hot Reload
Browser updates automatically

### 3. Debug Issues
- Check Terminal for errors
- Check Browser DevTools (F12)
- Check VS Code Problems (Ctrl + Shift + M)

### 4. Format Code
Press: `Shift + Alt + F` (auto-format)

### 5. Commit Changes
Use Git to version control:
```bash
git add .
git commit -m "Your message"
git push
```

---

## 💡 Tips & Tricks

### 1. Quick Navigate
- `Ctrl + P` - Search files
- `Ctrl + F` - Find in file
- `Ctrl + H` - Find & replace

### 2. Intellisense
- Start typing component name
- Press `Ctrl + Space` for suggestions

### 3. Debug Console
- `Ctrl + J` - Toggle terminal
- `F12` - Browser DevTools

### 4. Code Snippets
- Type `rafce` - React arrow function component
- Type `imp` - Import statement

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite User Guide](https://vitejs.dev/guide/)
- [React Router Guide](https://reactrouter.com/)

---

## ✨ Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open `http://localhost:5173`
4. ✅ Explore the application
5. ✅ Make code changes and see hot reload
6. ✅ Read component files to understand structure

---

## 🆘 Need Help?

### Check These First:
1. Terminal shows no errors
2. Backend running on 8080
3. Port 5173 not in use
4. Node.js version 16+
5. All dependencies installed

### Still Having Issues?
- Check browser console (F12)
- Check VS Code Problems panel (Ctrl + Shift + M)
- Restart terminal and server
- Check backend logs

---

## 📞 Support

For questions or issues:
1. Check README.md
2. Review error messages
3. Check VS Code Problems panel
4. Contact development team

---

## 🎉 You're All Set!

Your Employee Training Frontend is ready to use!

Happy coding! 🚀
