# Quick Start - 5 Minutes

Get the Employee Training Frontend running in VS Code in 5 minutes!

## ✅ Prerequisites
- Node.js installed? Check: `node --version` (need 16+)
- VS Code installed?

---

## 🚀 5-Minute Setup

### 1. Open Folder in VS Code
```
File → Open Folder → EmployeeTrainingFrontend
```

### 2. Open Terminal in VS Code
```
Ctrl + ~ (or Cmd + ~ on Mac)
```

### 3. Install Dependencies
```bash
npm install
```
Wait 1-2 minutes...

### 4. Start Server
```bash
npm run dev
```

### 5. Open in Browser
```
http://localhost:5173
```

---

## ✨ That's It!

You're running the frontend! Changes auto-save and reload.

---

## 🛑 Stop Server

Press: `Ctrl + C` in terminal

---

## 🔥 Troubleshooting (2 Minutes)

### White blank page?
- Press F12 to check console for errors
- Restart: `npm run dev`

### Port 5173 in use?
```bash
npm run dev -- --port 3000
# Then go to http://localhost:3000
```

### npm not found?
- Restart VS Code
- Restart computer
- Reinstall Node.js

---

## 📖 Need More Help?

Read: `VSCODE_SETUP_GUIDE.md` (detailed guide)

---

## 🎯 Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production
npm run preview

# Stop server
Ctrl + C
```

---

## 📁 Key Files to Edit

```
src/
├── pages/
│   ├── Dashboard.tsx       ← Main dashboard
│   ├── Browse.tsx          ← Course browser
│   └── CourseDetail.tsx    ← Course page
├── components/
│   ├── Navbar.tsx          ← Navigation
│   └── CourseCard.tsx      ← Course card
└── App.tsx                 ← Main app
```

---

## 🌐 Backend Connection

Frontend needs backend on: `http://localhost:8080`

Make sure your Spring Boot backend is running!

---

## 🎉 You're Done!

Happy coding! 🚀

For detailed guide, see `VSCODE_SETUP_GUIDE.md`
