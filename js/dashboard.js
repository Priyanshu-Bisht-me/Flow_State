// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation between sections
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('logout')) return;
            
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Update dashboard stats when switching to dashboard
            if (sectionId === 'dashboard') {
                updateDashboardStats();
            }
        });
    });
    
    // Initialize all functionality
    initTimeTracker();
    initHabitTracker();
    initNotes();
    updateDashboardStats();
    
    // Update dashboard stats periodically
    setInterval(updateDashboardStats, 30000); // Update every 30 seconds
});

// Time Tracker functionality
function initTimeTracker() {
    let timerInterval;
    let seconds = 0;
    let isRunning = false;
    
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Load saved sessions from localStorage
    loadSessions();
    
    // Start button event
    startBtn.addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            
            timerInterval = setInterval(function() {
                seconds++;
                updateTimerDisplay();
            }, 1000);
        }
    });
    
    // Pause button event
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            
            clearInterval(timerInterval);
            
            // Save session when paused
            if (seconds > 0) {
                saveSession();
            }
        }
    });
    
    // Reset button event
    resetBtn.addEventListener('click', function() {
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        clearInterval(timerInterval);
        seconds = 0;
        updateTimerDisplay();
    });
    
    // Update timer display
    function updateTimerDisplay() {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Save session to localStorage
    function saveSession() {
        const sessions = getSessions();
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toLocaleTimeString();
        
        // Check if there's already a session for today
        const existingSessionIndex = sessions.findIndex(s => s.date === today);
        
        if (existingSessionIndex !== -1) {
            // Update existing session
            sessions[existingSessionIndex].totalSeconds += seconds;
            sessions[existingSessionIndex].sessions.push({
                time: seconds,
                timestamp: now
            });
        } else {
            // Create new session for today
            sessions.push({
                date: today,
                totalSeconds: seconds,
                sessions: [{
                    time: seconds,
                    timestamp: now
                }]
            });
        }
        
        // Save to localStorage
        localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
        
        // Reset timer and update display
        seconds = 0;
        updateTimerDisplay();
        
        // Reload sessions list
        loadSessions();
    }
    
    // Get sessions from localStorage
    function getSessions() {
        const sessionsJSON = localStorage.getItem('focusflow_sessions');
        return sessionsJSON ? JSON.parse(sessionsJSON) : [];
    }
    
    // Load and display sessions
    function loadSessions() {
        const sessions = getSessions();
        const sessionList = document.getElementById('session-list');
        const today = new Date().toISOString().split('T')[0];
        
        // Clear session list
        sessionList.innerHTML = '';
        
        // Find today's sessions
        const todaySessions = sessions.find(s => s.date === today);
        
        if (todaySessions && todaySessions.sessions) {
            // Display today's sessions
            todaySessions.sessions.forEach(session => {
                const sessionItem = document.createElement('div');
                sessionItem.className = 'session-item';
                
                const hours = Math.floor(session.time / 3600);
                const minutes = Math.floor((session.time % 3600) / 60);
                const secs = session.time % 60;
                
                sessionItem.innerHTML = `
                    <div class="session-time">${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s</div>
                    <div class="session-date">${session.timestamp}</div>
                `;
                
                sessionList.appendChild(sessionItem);
            });
        } else {
            // No sessions today
            sessionList.innerHTML = '<p>No sessions recorded today.</p>';
        }
    }
}

// Habit Tracker functionality
function initHabitTracker() {
    const habitInput = document.getElementById('habit-input');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitsContainer = document.getElementById('habits-container');
    
    // Load habits from localStorage
    loadHabits();
    
    // Add habit button event
    addHabitBtn.addEventListener('click', function() {
        const habitText = habitInput.value.trim();
        
        if (habitText) {
            addHabit(habitText);
            habitInput.value = '';
        }
    });
    
    // Add habit on Enter key
    habitInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addHabitBtn.click();
        }
    });
    
    // Add a new habit
    function addHabit(text) {
        const habits = getHabits();
        const today = new Date().toISOString().split('T')[0];
        
        const newHabit = {
            id: Date.now(),
            text: text,
            created: today,
            completed: {}
        };
        
        habits.push(newHabit);
        saveHabits(habits);
        loadHabits();
    }
    
    // Get habits from localStorage
    function getHabits() {
        const habitsJSON = localStorage.getItem('focusflow_habits');
        return habitsJSON ? JSON.parse(habitsJSON) : [];
    }
    
    // Save habits to localStorage
    function saveHabits(habits) {
        localStorage.setItem('focusflow_habits', JSON.stringify(habits));
    }
    
    // Load and display habits
    function loadHabits() {
        const habits = getHabits();
        const today = new Date().toISOString().split('T')[0];
        
        // Clear habits container
        habitsContainer.innerHTML = '';
        
        if (habits.length === 0) {
            habitsContainer.innerHTML = '<p>No habits added yet. Add your first habit above!</p>';
            return;
        }
        
        // Display each habit
        habits.forEach(habit => {
            const habitItem = document.createElement('div');
            habitItem.className = 'habit-item';
            
            const isCompleted = habit.completed[today] || false;
            
            habitItem.innerHTML = `
                <input type="checkbox" class="habit-checkbox" ${isCompleted ? 'checked' : ''} data-id="${habit.id}">
                <div class="habit-text">${habit.text}</div>
                <div class="habit-actions">
                    <button class="delete-habit" data-id="${habit.id}">🗑️</button>
                </div>
            `;
            
            habitsContainer.appendChild(habitItem);
        });
        
        // Add event listeners for checkboxes
        document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const habitId = parseInt(this.getAttribute('data-id'));
                const isChecked = this.checked;
                toggleHabitCompletion(habitId, isChecked);
            });
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-habit').forEach(button => {
            button.addEventListener('click', function() {
                const habitId = parseInt(this.getAttribute('data-id'));
                deleteHabit(habitId);
            });
        });
    }
    
    // Toggle habit completion status
    function toggleHabitCompletion(habitId, isCompleted) {
        const habits = getHabits();
        const today = new Date().toISOString().split('T')[0];
        
        const habitIndex = habits.findIndex(h => h.id === habitId);
        
        if (habitIndex !== -1) {
            habits[habitIndex].completed[today] = isCompleted;
            saveHabits(habits);
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
    
    // Delete a habit
    function deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            const habits = getHabits();
            const updatedHabits = habits.filter(h => h.id !== habitId);
            saveHabits(updatedHabits);
            loadHabits();
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
}

// Notes functionality
function initNotes() {
    const noteText = document.getElementById('note-text');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const clearNoteBtn = document.getElementById('clear-note-btn');
    const notesListContainer = document.getElementById('notes-list-container');
    
    // Load notes from localStorage
    loadNotes();
    
    // Save note button event
    saveNoteBtn.addEventListener('click', function() {
        const text = noteText.value.trim();
        
        if (text) {
            saveNote(text);
            noteText.value = '';
        }
    });
    
    // Clear note button event
    clearNoteBtn.addEventListener('click', function() {
        noteText.value = '';
    });
    
    // Save a new note
    function saveNote(text) {
        const notes = getNotes();
        const now = new Date();
        
        const newNote = {
            id: Date.now(),
            text: text,
            timestamp: now.toISOString(),
            displayDate: now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        };
        
        notes.unshift(newNote); // Add to beginning of array
        saveNotes(notes);
        loadNotes();
    }
    
    // Get notes from localStorage
    function getNotes() {
        const notesJSON = localStorage.getItem('focusflow_notes');
        return notesJSON ? JSON.parse(notesJSON) : [];
    }
    
    // Save notes to localStorage
    function saveNotes(notes) {
        localStorage.setItem('focusflow_notes', JSON.stringify(notes));
    }
    
    // Load and display notes
    function loadNotes() {
        const notes = getNotes();
        
        // Clear notes container
        notesListContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesListContainer.innerHTML = '<p>No notes saved yet. Write your first note above!</p>';
            return;
        }
        
        // Display each note
        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            
            noteItem.innerHTML = `
                <div class="note-content">${note.text}</div>
                <div class="note-meta">
                    <span>${note.displayDate}</span>
                </div>
                <div class="note-actions">
                    <button class="delete-note" data-id="${note.id}">Delete</button>
                </div>
            `;
            
            notesListContainer.appendChild(noteItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-note').forEach(button => {
            button.addEventListener('click', function() {
                const noteId = parseInt(this.getAttribute('data-id'));
                deleteNote(noteId);
            });
        });
    }
    
    // Delete a note
    function deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            const notes = getNotes();
            const updatedNotes = notes.filter(n => n.id !== noteId);
            saveNotes(updatedNotes);
            loadNotes();
        }
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Update today's focus time
    updateTodayTime();
    
    // Update today's habits
    updateTodayHabits();
    
    // Update total notes
    updateTotalNotes();
    
    // Update productivity score
    updateProductivityScore();
    
    // Update recent activity
    updateRecentActivity();
    
    // Update stats section
    updateStatsSection();
}

// Update today's focus time on dashboard
function updateTodayTime() {
    const sessions = getSessions();
    const today = new Date().toISOString().split('T')[0];
    
    const todaySession = sessions.find(s => s.date === today);
    const totalSeconds = todaySession ? todaySession.totalSeconds : 0;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    document.getElementById('today-time').textContent = `${hours}h ${minutes}m`;
}

// Update today's habits on dashboard
function updateTodayHabits() {
    const habits = getHabits();
    const today = new Date().toISOString().split('T')[0];
    
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completed[today]).length;
    
    document.getElementById('today-habits').textContent = `${completedHabits}/${totalHabits}`;
}

// Update total notes on dashboard
function updateTotalNotes() {
    const notes = getNotes();
    document.getElementById('total-notes').textContent = notes.length;
}

// Update productivity score on dashboard
function updateProductivityScore() {
    const habits = getHabits();
    const today = new Date().toISOString().split('T')[0];
    
    let score = 0;
    
    // Calculate based on habits completion
    if (habits.length > 0) {
        const completedHabits = habits.filter(h => h.completed[today]).length;
        score = Math.round((completedHabits / habits.length) * 100);
    }
    
    // Add time tracking factor (simplified)
    const sessions = getSessions();
    const todaySession = sessions.find(s => s.date === today);
    
    if (todaySession) {
        const hours = todaySession.totalSeconds / 3600;
        // If user tracked more than 1 hour today, add to score (capped at 30 points)
        if (hours > 1) {
            score += Math.min(30, Math.round(hours * 10));
        }
    }
    
    // Cap at 100%
    score = Math.min(100, score);
    
    document.getElementById('productivity-score').textContent = `${score}%`;
}

// Update recent activity on dashboard
function updateRecentActivity() {
    const activityList = document.getElementById('activity-list');
    const activities = [];
    
    // Get recent sessions
    const sessions = getSessions();
    const today = new Date().toISOString().split('T')[0];
    
    const todaySession = sessions.find(s => s.date === today);
    if (todaySession && todaySession.sessions) {
        todaySession.sessions.forEach(session => {
            activities.push({
                type: 'time',
                text: `Tracked ${formatTime(session.time)} of focus time`,
                time: session.timestamp
            });
        });
    }
    
    // Get recent habit completions
    const habits = getHabits();
    habits.forEach(habit => {
        const today = new Date().toISOString().split('T')[0];
        if (habit.completed[today]) {
            activities.push({
                type: 'habit',
                text: `Completed habit: ${habit.text}`,
                time: 'Today'
            });
        }
    });
    
    // Get recent notes (last 3)
    const notes = getNotes().slice(0, 3);
    notes.forEach(note => {
        activities.push({
            type: 'note',
            text: `Added a new note`,
            time: note.displayDate.split(' ')[1] // Just the time part
        });
    });
    
    // Sort activities by time (most recent first) - simplified
    activities.sort((a, b) => {
        if (a.time === 'Today' && b.time !== 'Today') return -1;
        if (a.time !== 'Today' && b.time === 'Today') return 1;
        return 0;
    });
    
    // Clear activity list
    activityList.innerHTML = '';
    
    // Display activities (max 5)
    const displayActivities = activities.slice(0, 5);
    
    if (displayActivities.length === 0) {
        activityList.innerHTML = '<p>No recent activity. Start tracking your time and habits!</p>';
        return;
    }
    
    displayActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        let icon = '📊';
        if (activity.type === 'habit') icon = '✅';
        if (activity.type === 'note') icon = '📝';
        
        activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-text">${activity.text}</div>
            <div class="activity-time">${activity.time}</div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Update stats section
function updateStatsSection() {
    const sessions = getSessions();
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's time
    const todaySession = sessions.find(s => s.date === today);
    const todaySeconds = todaySession ? todaySession.totalSeconds : 0;
    const todayHours = Math.floor(todaySeconds / 3600);
    const todayMinutes = Math.floor((todaySeconds % 3600) / 60);
    
    document.getElementById('stat-today').textContent = `${todayHours}h ${todayMinutes}m`;
    
    // Calculate this week's time
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= oneWeekAgo;
    });
    
    const weekSeconds = weekSessions.reduce((total, session) => total + session.totalSeconds, 0);
    const weekHours = Math.floor(weekSeconds / 3600);
    const weekMinutes = Math.floor((weekSeconds % 3600) / 60);
    
    document.getElementById('stat-week').textContent = `${weekHours}h ${weekMinutes}m`;
    
    // Calculate all time
    const allSeconds = sessions.reduce((total, session) => total + session.totalSeconds, 0);
    const allHours = Math.floor(allSeconds / 3600);
    
    document.getElementById('stat-all').textContent = `${allHours}h`;
    
    // Calculate habit completion percentage
    const habits = getHabits();
    const todayHabits = habits.filter(h => h.completed[today]).length;
    const habitPercentage = habits.length > 0 ? Math.round((todayHabits / habits.length) * 100) : 0;
    
    document.getElementById('habit-progress').style.width = `${habitPercentage}%`;
    document.getElementById('habit-percentage').textContent = `${habitPercentage}%`;
}

// Helper function to get sessions (used by multiple functions)
function getSessions() {
    const sessionsJSON = localStorage.getItem('focusflow_sessions');
    return sessionsJSON ? JSON.parse(sessionsJSON) : [];
}

// Helper function to get habits (used by multiple functions)
function getHabits() {
    const habitsJSON = localStorage.getItem('focusflow_habits');
    return habitsJSON ? JSON.parse(habitsJSON) : [];
}

// Helper function to get notes (used by multiple functions)
function getNotes() {
    const notesJSON = localStorage.getItem('focusflow_notes');
    return notesJSON ? JSON.parse(notesJSON) : [];
}

// Helper function to format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}