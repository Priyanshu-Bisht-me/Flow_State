# FlowState - Time Tracker & Personal Dashboard

A fully functional, modern **Time Tracker & Personal Dashboard** built with vanilla HTML, CSS, and JavaScript. Track focus sessions, monitor productivity, and gain insights into your work patterns — all in your browser with no backend needed!

---

## 🚀 Quick Start

### **Prerequisites**
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation needed
- No internet required (works offline)

### **How to Run**

**IMPORTANT:** You must use a local server to run this app. Opening `index.html` directly won't work due to browser security restrictions.

#### **Option 1: Python (Recommended)**
```powershell
cd c:\Users\priya\OneDrive\Desktop\floww2
python -m http.server 8000
```
Then open: **http://localhost:8000** in your browser

#### **Option 2: Node.js (if installed)**
```powershell
cd c:\Users\priya\OneDrive\Desktop\floww2
npx http-server
```
Then open the URL shown (usually **http://localhost:8080**)

#### **Option 3: Live Server (VS Code Extension)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens automatically

### **Why Not Open index.html Directly?**
When you open files with `file://` protocol:
- ❌ localStorage may be blocked (security restriction)
- ❌ External CDN resources (Chart.js, FontAwesome) may fail
- ❌ Some features won't work properly
- ✅ **Using a local server fixes all these issues**

---

## 📋 Features Overview

### **Dashboard Page**
- **Summary Cards**: Today's focus time, sessions completed, weekly total, top project
- **Interactive Charts**: 
  - Focus time by day (bar chart)
  - Time distribution by project (pie chart)
  - Session trends over time (line chart)
  - Session length distribution (bar chart)
- **Recommended Tasks**: High-priority tasks to tackle
- **Recent Sessions**: Your 5 most recent focus sessions

### **Tasks Page**
- **Create Tasks**: Name, project, priority level
- **Organize**: Filter by project, search by name
- **Track**: See total focus time spent on each task
- **Quick Actions**: Start/Resume session for any task
- **Project Sidebar**: Color-coded project list with icons

### **Focus Session Page**
- **Task Selection**: Choose which task to focus on
- **Mode Toggle**: Countdown timer vs. Flowtime (open-ended)
- **Session Lengths**: 15, 25, 45, or 60 minutes (customizable)
- **Circular Timer**: Beautiful SVG progress ring with real-time updates
- **Flow Meter**: Visual progress bar showing session completion
- **Distraction Counter**: Track how many times you got distracted
- **Session Info**: Shows selected project, expected end time, break schedule
- **Session Controls**: Start, Pause, Stop buttons
- **Session Completion Modal**: Rate your focus (1-5 stars), add notes, tag distractions

### **History & Insights Page**
- **Sessions by Day**: Browse all past sessions grouped chronologically
- **Session Details**: Task name, duration, rating, notes for each session
- **Real-Time Insights** (auto-calculated):
  - **Best Focus Time**: Time range when you're most productive
  - **Average Session Length**: How long your sessions typically are
  - **Most Focused Day**: Which day of week you're most focused
  - **Total This Month**: Cumulative hours and session count
- **Filters**: Date range, project filter, focus sessions only

### **Settings Page**
- **Profile Section**:
  - Full name
  - Email
  - **Avatar Upload**: Upload a JPG/PNG photo (max 2MB) - displays in header
- **Preferences Section**:
  - Default session length
  - Work hours start time
  - Theme (Light, Dark, System)
  - Notification toggles
- **Data & Privacy Section**:
  - **Export Data**: Download all sessions as JSON
  - **Reset to Defaults**: Clear data and reinitialize with sample projects
  - **Delete All Data**: Permanently delete everything
  - Account deletion option

---

## 🎮 How to Use

### **Creating Your First Task**
1. Go to **Tasks** page
2. Click **"+ New Task"** button
3. Fill in task name (e.g., "Design landing page")
4. Select or create a project
5. Choose priority (optional)
6. Click **Create**

### **Starting a Focus Session**
1. Go to **Focus Session** page
2. **Select Task** from dropdown
3. Choose **Mode**: 
   - Countdown: Set timer (15/25/45/60 min)
   - Flowtime: Open-ended, no timer
4. Click **Start** button
5. Watch the circular timer and flow meter
6. Use **Pause** if you need a break
7. Click **Stop** when done

### **Rating & Saving Your Session**
1. After clicking **Stop**, a modal appears
2. **Rate your focus**: Click 1-5 stars
3. **Tag distractions** (optional): Social Media, Meetings, Tired, Interruptions, Other
4. **Add notes** (optional): What you accomplished
5. Click **Save Session**
6. Session appears in History and updates Dashboard

### **Uploading Your Avatar**
1. Go to **Settings** → **Profile**
2. Click **Choose File** under "Avatar"
3. Select a JPG or PNG image (max 2MB)
4. Click **Save Profile**
5. Your photo appears in the top-right corner immediately

### **Viewing Your Progress**
1. **Dashboard**: See overview, charts, recent activity
2. **History**: Browse all past sessions by date
3. **Insights**: View auto-calculated productivity patterns
4. **Export**: Download your data as JSON from Settings

---

## 💾 Data Storage

**All data is stored locally in your browser's localStorage:**
- ✅ No internet required
- ✅ No account needed
- ✅ No data sent to servers
- ✅ Persists between browser sessions
- ✅ Survives page refreshes
- ⚠️ Clears if you clear browser cache/storage

### **Stored Data Keys**
- `flowstate_tasks` - Your tasks
- `flowstate_sessions` - Your focus sessions
- `flowstate_projects` - Your projects
- `flowstate_profile` - Name, email, avatar
- `flowstate_initialized` - First-run flag
- `theme` - Your theme preference

---

## 🎨 Customization

### **Change Colors**
Edit `styles.css`:
```css
:root {
    --color-primary: #3b82f6;      /* Blue - change to any color */
    --color-text: #1a1a1a;         /* Text color */
    --color-bg: #ffffff;           /* Background */
}
```

### **Change Default Session Length**
In `index.html`, find the session length dropdown and change the default:
```html
<option value="25" selected>25 minutes</option>
```

### **Add New Projects**
Create them on the fly in the New Task dialog, or add sample projects in code.

---

## 🌙 Dark Mode

Automatic dark mode support:
- **Light**: Default when system prefers light
- **Dark**: Activates when system prefers dark or when selected in Settings
- **Theme Toggle**: Available in Settings → Preferences
- **Persists**: Your choice is saved across sessions

---

## 📊 Charts & Analytics

### **Dashboard Charts**
- **Focus by Day** (Bar): How many hours you focused each day
- **Time by Project** (Pie): Time allocation across projects
- **Session Trends** (Line): Session count over time
- **Session Distribution** (Bar): Frequency of different session lengths

### **Automatic Insights**
- Calculated from your real session data
- Update as you complete sessions
- No manual input needed
- Hide automatically when no sessions exist

---

## 🔄 Sample Data

On first run, the app seeds:
- **3 Sample Projects**: Design System, Development, Documentation
- **12 Sample Sessions**: From the past week showing realistic productivity patterns
- **Empty Tasks**: You start fresh with no pre-set tasks

Reset to defaults anytime via **Settings → Reset to Defaults**

---

## ⚙️ Technical Details

### **Tech Stack**
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Charts**: Chart.js library (CDN)
- **Icons**: FontAwesome 6.4.0 (CDN)
- **Storage**: Browser localStorage API
- **Server**: Python http.server or Node.js http-server

### **Browser Support**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ All modern mobile browsers

### **File Structure**
```
floww2/
├── index.html          (Main app - all pages)
├── styles.css          (All styling, responsive design)
├── script.js           (All functionality, 1400+ lines)
├── README.md           (This file)
├── FEATURES.md         (Detailed feature list)
├── IMPLEMENTATION.md   (Technical implementation notes)
└── projectModal.html   (Helper file)
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **App won't load** | Make sure you're using `http://localhost:8000`, not `file://` |
| **Charts not showing** | Refresh page, check Chart.js loaded in console |
| **Data disappeared** | Check if localStorage was cleared, check Settings for reset options |
| **Avatar not updating** | Make sure file is JPG/PNG and under 2MB |
| **Timer not working** | Select a task first (required), enable JavaScript |
| **localStorage blocked** | You're probably using `file://` - use the Python server instead |

---

## 💡 Pro Tips

1. **Be Consistent**: Log sessions daily for better insights
2. **Rate Honestly**: Ratings (1-5 stars) help identify your peak productivity hours
3. **Use Projects**: Organize by project to see time allocation
4. **Tag Distractions**: Help identify patterns in what blocks your focus
5. **Export Weekly**: Export your data to backup or analyze elsewhere
6. **Check Insights**: Review "Best Focus Time" to schedule deep work accordingly
7. **Use Flowtime**: Try open-ended Flowtime mode for deep work sessions

---

## 📈 Data Flow

```
1. Create Task
   ↓
2. Start Focus Session
   ↓
3. Run Timer (Countdown or Flowtime)
   ↓
4. Complete → Rate & Add Notes
   ↓
5. Save to localStorage
   ↓
6. ✅ Dashboard/Tasks/History/Insights Update Automatically
```

---

## 🎯 What's Included

- ✅ Full task management system
- ✅ Timed focus sessions with progress visualization
- ✅ Session rating and note-taking
- ✅ Distraction tracking and tagging
- ✅ Real-time analytics and insights
- ✅ Project-based organization
- ✅ Dark/Light theme support
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ Avatar profile picture upload
- ✅ Data export to JSON
- ✅ Interactive charts and graphs
- ✅ Offline-first (works without internet)
- ✅ No backend required
- ✅ No database needed
- ✅ No authentication needed

---

## 🚀 Next Steps

1. **Run the Server**: `python -m http.server 8000`
2. **Open App**: Visit `http://localhost:8000`
3. **Create a Task**: Start with something you want to work on
4. **Start Your First Session**: Click that Start button!
5. **Complete & Rate**: Finish your session and give it a rating
6. **Watch Dashboard Update**: See your stats populate in real-time

---

## 📞 Notes

- All development was done with vanilla JavaScript (no frameworks)
- All styling is custom CSS (no Bootstrap or UI frameworks)
- Charts powered by open-source Chart.js library
- Icons from FontAwesome CDN
- Fully responsive for all screen sizes

---

**Ready to focus? Open http://localhost:8000 and start tracking! 🎯**
