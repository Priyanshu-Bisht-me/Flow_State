# Flow State - Time Tracker & Personal Dashboard

A beautiful, modern **Time Tracker & Personal Dashboard** built with vanilla HTML, CSS, and JavaScript. Track focus sessions, manage projects, and gain productivity insights — all in your browser with no backend needed!

---

## 🎯 Key Features

### **📊 Dashboard Page**
- Summary cards: Today's focus time, sessions completed, weekly stats, top project
- Interactive charts (auto-hide until data exists):
  - Focus by Day (7-day bar chart)
  - Time by Project (pie chart)
  - Session Trend (line chart)
  - Session Length Distribution (bar chart)
- Next Up tasks list with quick start buttons
- Recent sessions display

### **⏱️ Focus Session Page**
- **Task Selection**: Choose from your project tasks
- **Timer Modes**:
  - Countdown: 15, 25, 45, 60 minutes
  - Flowtime: Open-ended (you control duration)
  - Custom: Set any duration from 1-180 minutes
- **Real-time Displays**:
  - Animated circular SVG progress ring
  - Project name and expected end time
  - Break duration and time
  - Flow meter (progress bar with glow effect)
  - Distraction counter (+/- buttons)
- **Session Complete**: Rate sessions (1-5 stars), add notes, tag distractions
- **Glassmorphism UI**: Premium design with blur effects and modern aesthetics

### **📋 Tasks & Projects Page**
- Create and manage tasks with project, priority, and status
- Create custom projects with color codes
- Project sidebar showing all projects and time spent
- Search and filter tasks by project
- Quickly start sessions from task list
- Auto-sync focus time when sessions complete

### **📈 History & Insights Page**
- Browse all sessions grouped by date
- Session details: duration, rating, notes, distractions
- Real-time insights (auto-calculated):
  - Best focus time (most productive time of day)
  - Average session length
  - Most focused day of week
  - Total monthly hours
- Date range and project filtering

### **⚙️ Settings Page**
- **Profile**: Avatar upload (JPG/PNG, max 2MB), name, email
- **Preferences**: Theme toggle (Light/Dark), session defaults
- **Data**: Export to JSON, clear all data

---

## 🚀 Quick Start

### **How to Run**

**⚠️ IMPORTANT**: Use a local server (not `file://` protocol)

#### **Option 1: Python (Recommended)**
```powershell
cd C:\Users\priya\OneDrive\Desktop\floww2
python -m http.server 8000
```
Open: **http://localhost:8000**

#### **Option 2: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

#### **Option 3: Node.js**
```bash
npx http-server
```

---

## 💾 Data Storage

- All data stored in **localStorage** (browser-based, no server)
- Works offline
- Persists across sessions
- Export to JSON for backup
- Keys: `flowstate_tasks`, `flowstate_sessions`, `flowstate_projects`, `flowstate_profile`, `theme`

---

## 🎮 How to Use

### **1. Create a Task**
- Tasks page → Click "+ New Task"
- Enter task name
- Select or create project
- Choose priority

### **2. Start Focus Session**
- Focus page → Select task from dropdown
- Choose mode (Countdown/Flowtime)
- Set duration (15, 25, 45, 60 min, or custom)
- Click **START**

### **3. Complete Session**
- Click **STOP** when done
- Modal appears → Rate your focus (1-5 stars)
- Add notes and tag distractions (optional)
- Click **Save Session**

### **4. View Progress**
- **Dashboard**: See charts and stats (appear after first session)
- **History**: Browse all past sessions
- **Insights**: View productivity patterns
- **Settings**: Upload profile photo

---

## 🎨 Design & Features

- **Responsive**: Desktop, tablet, mobile optimized
- **Dark Mode**: Automatic system detection + manual toggle
- **Glassmorphism**: Modern UI with blur effects and gradients
- **Smooth Animations**: Fade-ins, transitions, progress animations
- **Color-Coded Projects**: Visual organization
- **SVG Timer Ring**: Animated circular progress indicator

---

## 🌐 Browser Support

✅ Chrome, Firefox, Safari, Edge (all modern versions)
✅ Mobile browsers (iOS Safari, Chrome Mobile)
✅ Offline-capable

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px-1199px (optimized layout)
- **Mobile**: <768px (stacked layout)

---

## 🔧 Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Charts**: Chart.js (CDN)
- **Icons**: Font Awesome 6.4.0 (CDN)
- **Storage**: Browser localStorage API
- **Layout**: CSS Grid & Flexbox
- **Styling**: CSS custom properties, responsive media queries

---

## 📁 File Structure

```
floww2/
├── index.html           # Main HTML (722 lines, 5 pages + modals)
├── styles.css           # Stylesheet (1506 lines, responsive design)
├── script.js            # JavaScript (1681 lines, all functionality)
├── README.md            # This file
├── FEATURES.md          # Detailed features
└── IMPLEMENTATION.md    # Technical details
```

---

## ⚙️ Configuration

### **Change Primary Color**
Edit `styles.css`:
```css
:root {
    --color-primary: #3b82f6;  /* Change to any hex color */
}
```

### **Change Default Session Length**
Edit `index.html` in Focus Session page:
```html
<option value="25" selected>25 minutes</option>
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't load | Use `http://localhost:8000`, not `file://` |
| Charts don't show | Create a session first, charts appear automatically |
| Data lost | Check localStorage in DevTools, don't clear browser cache |
| Avatar not saving | File must be JPG/PNG, under 2MB |
| Timer not working | Select a task first (required) |

---

## 💡 Tips

- **Be Consistent**: Log sessions daily for better insights
- **Check Insights**: See your "Best Focus Time" to schedule deep work
- **Use Projects**: Organize tasks to see time allocation
- **Export Weekly**: Backup your data via Settings → Export JSON
- **Adjust Duration**: Use custom timer for non-standard sessions

---

## 🎯 What's Included

✅ Full task management  
✅ Timed focus sessions with animations  
✅ Session rating & note-taking  
✅ Distraction tracking  
✅ Real-time analytics  
✅ Project-based organization  
✅ Dark/Light theme  
✅ Responsive design  
✅ Avatar profile upload  
✅ Data export  
✅ Interactive charts  
✅ Offline-first  
✅ No backend required  
✅ No database needed  

---

## 📊 Sample Data

Starting fresh with blank initialization:
- No pre-loaded projects
- No pre-loaded tasks
- No pre-loaded sessions
- Charts hide until you create data

---

## 🚀 Getting Started

1. Run: `python -m http.server 8000`
2. Open: `http://localhost:8000`
3. Create your first project and task
4. Start your first focus session
5. Complete and rate it
6. Watch your dashboard populate!

---

**Track your focus. Improve your productivity. 🎯**

Version 1.0.0 | December 2025
