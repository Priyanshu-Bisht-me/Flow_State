/* ============================================
   FLOWSTATE - JavaScript Functionality
   ============================================ */

// ============================================
// 0. DATA MANAGEMENT
// ============================================

const DB = {
    getTasks: () => JSON.parse(localStorage.getItem('flowstate_tasks')) || [],
    setTasks: (tasks) => localStorage.setItem('flowstate_tasks', JSON.stringify(tasks)),
    
    getSessions: () => JSON.parse(localStorage.getItem('flowstate_sessions')) || [],
    setSessions: (sessions) => localStorage.setItem('flowstate_sessions', JSON.stringify(sessions)),
    
    getProjects: () => JSON.parse(localStorage.getItem('flowstate_projects')) || [],
    setProjects: (projects) => localStorage.setItem('flowstate_projects', JSON.stringify(projects)),
    
    addTask: (task) => {
        const tasks = DB.getTasks();
        const newTask = {
            id: Date.now(),
            ...task,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        DB.setTasks(tasks);
        return newTask;
    },
    
    deleteTask: (taskId) => {
        const tasks = DB.getTasks().filter(t => t.id !== taskId);
        DB.setTasks(tasks);
    },
    
    updateTask: (taskId, updates) => {
        const tasks = DB.getTasks().map(t => t.id === taskId ? { ...t, ...updates } : t);
        DB.setTasks(tasks);
    },
    
    addSession: (session) => {
        const sessions = DB.getSessions();
        const newSession = {
            id: Date.now(),
            ...session,
            date: new Date().toISOString()
        };
        sessions.push(newSession);
        DB.setSessions(sessions);
        return newSession;
    },
    
    addProject: (project) => {
        const projects = DB.getProjects();
        const newProject = {
            id: Date.now(),
            ...project,
            createdAt: new Date().toISOString()
        };
        projects.push(newProject);
        DB.setProjects(projects);
        return newProject;
    }
};

// ============================================
// 1. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    initializePage();
    initializeCharts();
    initializeEventListeners();
    loadProfileData();
    updateCurrentDate();
    loadTodayFocusTime();
});

function initializeData() {
    // Clear all old data to start fresh
    localStorage.removeItem('flowstate_tasks');
    localStorage.removeItem('flowstate_sessions');
    localStorage.removeItem('flowstate_projects');
    localStorage.removeItem('flowstate_profile');
    localStorage.removeItem('flowstate_initialized');
    
    // Initialize with empty data on first run - user adds projects as needed
    if (!localStorage.getItem('flowstate_initialized')) {
        // No sample projects - user starts completely blank
        // No sample sessions - user starts from scratch
        // No sample tasks - user starts from scratch
        
        // Just mark initialized so we don't reseed automatically
        localStorage.setItem('flowstate_initialized', '1');
    }
}

function initializePage() {
    // Set up navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage(this.dataset.page);
        });
    });

    // Set up start focus button
    const startFocusBtn = document.getElementById('startFocusBtn');
    if (startFocusBtn) {
        startFocusBtn.addEventListener('click', () => {
            navigateToPage('focus');
        });
    }

    // Load initial page data
    loadDashboardData();
    loadTasksPage();
    loadHistoryData();
    
    // Show dashboard by default
    navigateToPage('dashboard');
}

// ============================================
// 2. NAVIGATION
// ============================================

function navigateToPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // Load page-specific data
    if (pageName === 'dashboard') {
        loadDashboardData();
    } else if (pageName === 'tasks') {
        loadTasksPage();
    } else if (pageName === 'focus') {
        focusSessionInit();
    } else if (pageName === 'history') {
        loadHistoryData();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// 3. DATE & TIME
// ============================================

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

function loadTodayFocusTime() {
    const sessions = DB.getSessions();
    const today = new Date().toDateString();
    
    const todayTotal = sessions
        .filter(s => new Date(s.date).toDateString() === today)
        .reduce((sum, s) => sum + s.duration, 0);
    
    const hours = Math.floor(todayTotal / 60);
    const minutes = todayTotal % 60;
    
    const todayFocusCard = document.getElementById('todayFocusCard');
    const todayFocusTime = document.getElementById('todayFocusTime');
    
    if (todayFocusCard) {
        todayFocusCard.textContent = `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }
    if (todayFocusTime) {
        todayFocusTime.textContent = `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }
}

// ============================================
// 4. DASHBOARD DATA LOADING
// ============================================

function loadDashboardData() {
    const tasks = DB.getTasks();
    const sessions = DB.getSessions();
    const today = new Date().toDateString();

    // Check if there's any data
    const hasData = sessions.length > 0 || tasks.length > 0;

    // Hide/show charts based on data availability
    const chartsRows = document.querySelectorAll('.charts-row');
    chartsRows.forEach(row => {
        row.style.display = hasData ? 'grid' : 'none';
    });

    // Clear task and session lists
    const taskList = document.querySelector('.task-list');
    const sessionsList = document.querySelector('.sessions-list');
    if (taskList) taskList.innerHTML = '';
    if (sessionsList) sessionsList.innerHTML = '';

    // If no data, show empty state message
    if (!hasData) {
        // Clear summary cards to show "No data yet"
        document.getElementById('todayFocusCard').textContent = '0h 00m';
        document.querySelectorAll('.card-summary')[1].querySelector('.card-big-number').textContent = '0';
        document.querySelectorAll('.card-summary')[1].querySelector('.card-subtext').textContent = 'No sessions yet';
        document.querySelectorAll('.card-summary')[2].querySelector('.card-big-number').textContent = '0h 00m';
        document.querySelectorAll('.card-summary')[2].querySelector('.card-subtext').textContent = 'Streak: 0 days';
        document.querySelectorAll('.card-summary')[3].querySelector('.card-big-number').textContent = 'None';
        document.querySelectorAll('.card-summary')[3].querySelector('.card-subtext').textContent = 'Create a project';
        return;
    }

    // Calculate today's stats
    const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const hours = Math.floor(todayTotal / 60);
    const minutes = todayTotal % 60;

    // Update summary cards
    document.getElementById('todayFocusCard').textContent = `${hours}h ${String(minutes).padStart(2, '0')}m`;

    // Sessions completed today
    const completedToday = todaySessions.length;
    const avgLength = completedToday > 0 ? Math.round(todayTotal / completedToday) : 0;
    document.querySelectorAll('.card-summary')[1].querySelector('.card-big-number').textContent = completedToday;
    document.querySelectorAll('.card-summary')[1].querySelector('.card-subtext').textContent = `Avg length: ${avgLength} min`;

    // This week stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekStart);
    const weekTotal = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const weekHours = Math.floor(weekTotal / 60);
    const weekMinutes = weekTotal % 60;
    
    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    while (true) {
        const dateStr = currentDate.toDateString();
        const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateStr);
        if (daySessions.length === 0) break;
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    document.querySelectorAll('.card-summary')[2].querySelector('.card-big-number').textContent = 
        `${weekHours}h ${String(weekMinutes).padStart(2, '0')}m`;
    document.querySelectorAll('.card-summary')[2].querySelector('.card-subtext').textContent = 
        `Streak: ${streak} day${streak !== 1 ? 's' : ''}`;

    // Top project
    const projectTime = {};
    tasks.forEach(task => {
        projectTime[task.project] = (projectTime[task.project] || 0) + task.focusTime;
    });
    const topProject = Object.keys(projectTime).reduce((a, b) => 
        projectTime[a] > projectTime[b] ? a : b, Object.keys(projectTime)[0]);
    const topProjectTime = projectTime[topProject] || 0;
    const topHours = Math.floor(topProjectTime);
    const topMin = Math.round((topProjectTime % 1) * 60);
    document.querySelectorAll('.card-summary')[3].querySelector('.card-big-number').textContent = topProject;
    document.querySelectorAll('.card-summary')[3].querySelector('.card-subtext').textContent = 
        `${topHours}h ${topMin}m`;

    // Update charts
    updateFocusByDayChart();
    updateTimeByProjectChart();
    updateSessionTrendChart();
    updateSessionDistChart();

    // Update task list
    updateNextUpTasks();
    updateRecentSessions();
}

function updateNextUpTasks() {
    const tasks = DB.getTasks();
    const highPriority = tasks
        .filter(t => t.status !== 'Done')
        .sort((a, b) => (b.priority === 'high' ? 1 : -1))
        .slice(0, 5);

    const taskList = document.querySelector('.task-list');
    if (!taskList) return;

    taskList.innerHTML = highPriority.map(task => `
        <div class="task-item">
            <div class="task-info">
                <p class="task-name">${task.name}</p>
                <p class="task-project">${task.project}</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="selectTaskAndFocus('${task.name}')">Start</button>
        </div>
    `).join('');
}

function updateRecentSessions() {
    const sessions = DB.getSessions().slice(-5).reverse();
    const sessionsList = document.querySelector('.sessions-list');
    if (!sessionsList) return;

    sessionsList.innerHTML = sessions.map(session => {
        const stars = Array(5).fill('<i class="fas fa-star"></i>')
            .map((star, i) => i < session.rating ? star : '<i class="fas fa-star" style="color: #d1d5db;"></i>')
            .join('');
        
        return `
            <div class="session-item">
                <div class="session-info">
                    <p class="session-task">${session.taskName}</p>
                    <p class="session-duration">${session.duration} min</p>
                </div>
                <div class="session-rating">${stars}</div>
            </div>
        `;
    }).join('');
}

function updateFocusByDayChart() {
    const sessions = DB.getSessions();
    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dateStr);
        const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
        data.push(parseFloat((totalMinutes / 60).toFixed(2)));
    }

    if (focusByDayChart) {
        focusByDayChart.data.labels = labels;
        focusByDayChart.data.datasets[0].data = data;
        focusByDayChart.update();
    }
}

function updateTimeByProjectChart() {
    const tasks = DB.getTasks();
    const projectTime = {};
    
    tasks.forEach(task => {
        projectTime[task.project] = (projectTime[task.project] || 0) + task.focusTime;
    });

    const labels = Object.keys(projectTime);
    const data = Object.values(projectTime);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    if (timeByProjectChart) {
        timeByProjectChart.data.labels = labels;
        timeByProjectChart.data.datasets[0].data = data;
        timeByProjectChart.data.datasets[0].backgroundColor = colors.slice(0, labels.length);
        timeByProjectChart.update();
    }
}

function updateSessionTrendChart() {
    if (!sessionTrendChart) return;
    const sessions = DB.getSessions();
    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateStr);
        const count = sessions.filter(s => new Date(s.date).toDateString() === d.toDateString()).length;
        data.push(count);
    }
    sessionTrendChart.data.labels = labels;
    sessionTrendChart.data.datasets[0].data = data;
    sessionTrendChart.update();
}

function updateSessionDistChart() {
    if (!sessionDistChart) return;
    const sessions = DB.getSessions();
    const buckets = [0,0,0,0,0];
    sessions.forEach(s => {
        const d = s.duration || 0;
        if (d <= 15) buckets[0]++;
        else if (d <= 30) buckets[1]++;
        else if (d <= 45) buckets[2]++;
        else if (d <= 60) buckets[3]++;
        else buckets[4]++;
    });
    sessionDistChart.data.datasets[0].data = buckets;
    sessionDistChart.update();
}

// ============================================
// 5. TASKS PAGE FUNCTIONALITY
// ============================================

function loadTasksPage() {
    const tasks = DB.getTasks();
    // include explicit projects list plus projects inferred from tasks
    const explicitProjects = DB.getProjects().map(p => p.name);
    const inferredProjects = [...new Set(tasks.map(t => t.project))];
    const projects = [...new Set([...explicitProjects, ...inferredProjects])];

    // Update project filter dropdown
    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter) {
        const currentValue = projectFilter.value;
        projectFilter.innerHTML = '<option value="">All Projects</option>';
        projects.forEach(project => {
            projectFilter.innerHTML += `<option value="${project}">${project}</option>`;
        });
        projectFilter.value = currentValue;
    }

    // Update projects sidebar
    updateProjectsSidebar();

    // Update tasks table
    updateTasksTable(tasks);

    // Add new task button handler
    const newTaskBtn = document.getElementById('newTaskBtn');
    console.log('New Task Button:', newTaskBtn);
    if (newTaskBtn) {
        // Remove old listener if exists
        if (newTaskBtn.nextClick) {
            newTaskBtn.removeEventListener('click', newTaskBtn.nextClick);
        }
        // Add new listener
        newTaskBtn.nextClick = function() {
            console.log('New Task button clicked!');
            showNewTaskDialog();
        };
        newTaskBtn.addEventListener('click', newTaskBtn.nextClick);
        console.log('New Task button listener attached');
    } else {
        console.warn('New task button not found');
    }

    // Project filter handler
    if (projectFilter && !projectFilter.hasListener) {
        projectFilter.hasListener = true;
        projectFilter.addEventListener('change', function() {
            const filtered = this.value 
                ? tasks.filter(t => t.project === this.value)
                : tasks;
            updateTasksTable(filtered);
        });
    }

    // Search handler
    const searchInput = document.querySelector('#tasks-page input[placeholder="Search tasks..."]');
    if (searchInput && !searchInput.hasListener) {
        searchInput.hasListener = true;
        searchInput.addEventListener('keyup', function() {
            const filtered = tasks.filter(t => 
                t.name.toLowerCase().includes(this.value.toLowerCase())
            );
            updateTasksTable(filtered);
        });
    }

    // NEW PROJECT BUTTON - Attach to Tasks page specifically
    const newProjBtn = document.getElementById('newProjectBtn');
    if (newProjBtn && !newProjBtn.hasListener) {
        newProjBtn.hasListener = true;
        newProjBtn.addEventListener('click', () => {
            // Clear inputs before opening
            const nameInput = document.getElementById('projName');
            const colorInput = document.getElementById('projColor');
            if (nameInput) nameInput.value = '';
            if (colorInput) colorInput.value = '#3b82f6';
            
            const modal = document.getElementById('projectModal');
            if (modal) {
                modal.style.display = 'flex';
                if (nameInput) nameInput.focus();
            }
        });
    }

    // PROJECT MODAL SAVE/CANCEL - Attach listeners
    const saveProjBtn = document.getElementById('saveProj');
    const cancelProjBtn = document.getElementById('cancelProj');
    
    if (cancelProjBtn && !cancelProjBtn.hasListener) {
        cancelProjBtn.hasListener = true;
        cancelProjBtn.addEventListener('click', () => {
            const modal = document.getElementById('projectModal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (saveProjBtn && !saveProjBtn.hasListener) {
        saveProjBtn.hasListener = true;
        saveProjBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('projName');
            const colorInput = document.getElementById('projColor');
            
            if (!nameInput || !colorInput) {
                console.error('Form inputs not found');
                return;
            }
            
            const name = nameInput.value.trim();
            const color = colorInput.value.trim() || '#3b82f6';
            
            if (!name) {
                alert('Please enter a project name');
                nameInput.focus();
                return;
            }
            
            // Validate hex color
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                alert('Please enter a valid hex color (e.g., #3b82f6)');
                colorInput.focus();
                return;
            }
            
            // Create the project
            try {
                DB.addProject({ name, color });
                console.log('Project created:', name);
                
                // Close modal
                const modal = document.getElementById('projectModal');
                if (modal) modal.style.display = 'none';
                
                // Clear inputs
                nameInput.value = '';
                colorInput.value = '#3b82f6';
                
                // Refresh the UI
                loadTasksPage();
                loadDashboardData();
                
                alert(`Project "${name}" created successfully!`);
            } catch (error) {
                console.error('Error creating project:', error);
                alert('Error creating project. Check console.');
            }
        });
    }
}

function updateProjectsSidebar() {
    const tasks = DB.getTasks();
    const projects = DB.getProjects();
    const projectsList = document.querySelector('.projects-list');
    if (!projectsList) return;

    // Calculate time spent per project
    const projectTime = {};
    projects.forEach(project => {
        projectTime[project.name] = 0;
    });
    
    tasks.forEach(task => {
        if (projectTime.hasOwnProperty(task.project)) {
            projectTime[task.project] += task.focusTime;
        }
    });

    // Render all projects (even those with 0 hours)
    projectsList.innerHTML = projects.map(project => {
        const hours = projectTime[project.name] || 0;
        const h = Math.floor(hours);
        const m = Math.round((hours % 1) * 60);
        return `
            <div class="project-item" style="border-left: 4px solid ${project.color};" onclick="filterByProject(this, '${project.name}')">
                <p class="project-name">${project.name}</p>
                <p class="project-time">${h}h ${m}m</p>
            </div>
        `;
    }).join('');
}

function updateTasksTable(tasks) {
    const tbody = document.querySelector('.tasks-table tbody');
    if (!tbody) return;

    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.name}</td>
            <td>${task.project}</td>
            <td><span class="status-badge status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
            <td>${Math.floor(task.focusTime)}h ${Math.round((task.focusTime % 1) * 60)}m</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="selectTaskAndFocus('${task.name}')">
                    ${task.status === 'Done' ? 'View' : (task.status === 'In Progress' ? 'Resume' : 'Start')}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})" style="margin-left: 8px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterByProject(element, project) {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
    const tasks = DB.getTasks().filter(t => t.project === project);
    updateTasksTable(tasks);
}

function showNewTaskDialog() {
    console.log('showNewTaskDialog called');
    const taskName = prompt('Enter task name:', '');
    if (!taskName || taskName.trim() === '') {
        console.log('Task name is empty, returning');
        return;
    }

    const projects = DB.getProjects().map(p => p.name);
    console.log('Existing projects:', projects);
    
    let project;
    if (projects.length === 0) {
        project = prompt('No projects exist. Create a new project name:', 'My Project');
        if (!project || project.trim() === '') {
            return;
        }
        // Create the new project
        DB.addProject({ name: project, color: '#3b82f6' });
    } else {
        const projectList = projects.join(', ');
        project = prompt(`Select project (${projectList}):`, projects[0]);
        if (!project || project.trim() === '') {
            return;
        }
    }

    const priority = confirm('Mark as high priority?') ? 'high' : 'medium';

    try {
        DB.addTask({
            name: taskName.trim(),
            project: project.trim(),
            status: 'To Do',
            focusTime: 0,
            priority: priority
        });

        console.log('Task created successfully');
        loadTasksPage();
        loadDashboardData();
        alert(`Task "${taskName}" created successfully!`);
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Check console.');
    }
}

function deleteTask(taskId) {
    if (confirm('Delete this task?')) {
        DB.deleteTask(taskId);
        loadTasksPage();
        loadDashboardData();
    }
}

// ============================================
// 6. FOCUS SESSION LOGIC
// ============================================

let timerInterval = null;
let timeRemaining = 0;
let sessionTotalSeconds = 0;
let isTimerRunning = false;
let selectedTask = null;
let selectedTaskName = null;
let sessionStartTime = null;
let sessionElapsedTime = 0;
let sessionRating = 0;
let sessionTags = new Set();
let distractionCount = 0;

function focusSessionInit() {
    const taskSelect = document.getElementById('taskSelect');
    const sessionLength = document.getElementById('sessionLength');
    const flowTimer = document.getElementById('flowTimerDisplay');

    // Reset distraction count for new session
    distractionCount = 0;
    sessionRating = 0;
    sessionTags.clear();

    if (taskSelect) {
        const tasks = DB.getTasks();
        taskSelect.innerHTML = '<option value="">Choose a task...</option>';
        tasks.forEach(task => {
            taskSelect.innerHTML += `<option value="${task.name}">${task.name} (${task.project})</option>`;
        });
    }

    if (sessionLength) {
        timeRemaining = parseInt(sessionLength.value) * 60;
        sessionTotalSeconds = timeRemaining;
    }

    // sync displays
    if (flowTimer) flowTimer.textContent = formatDisplayTime(timeRemaining);
    updateProjectDisplay();
    updateTimerDisplay();
    attachFocusSessionListeners();
}

function attachFocusSessionListeners() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const sessionModal = document.getElementById('sessionModal');
    const starRating = document.getElementById('starRating');
    const taskSelect = document.getElementById('taskSelect');
    const sessionLength = document.getElementById('sessionLength');
    const modeBtns = document.querySelectorAll('.mode-btn');

    if (!startBtn) return;

    // Remove old listeners
    if (startBtn.nextStartBtn) startBtn.removeEventListener('click', startBtn.nextStartBtn);
    if (pauseBtn.nextPauseBtn) pauseBtn.removeEventListener('click', pauseBtn.nextPauseBtn);
    if (stopBtn.nextStopBtn) stopBtn.removeEventListener('click', stopBtn.nextStopBtn);
    
    // Task selector
    if (taskSelect) {
        if (taskSelect.nextChange) taskSelect.removeEventListener('change', taskSelect.nextChange);
        
        taskSelect.nextChange = function() {
            selectedTaskName = this.value || null;
            updateProjectDisplay();
        };
        taskSelect.addEventListener('change', taskSelect.nextChange);
    }

    // Session length selector
    if (sessionLength) {
        if (sessionLength.nextChange) sessionLength.removeEventListener('change', sessionLength.nextChange);
        
        sessionLength.nextChange = function() {
            if (!isTimerRunning) {
                timeRemaining = parseInt(this.value) * 60;
                updateTimerDisplay();
            }
        };
        sessionLength.addEventListener('change', sessionLength.nextChange);
    }

    // Mode toggle
    modeBtns.forEach(btn => {
        if (btn.nextClick) btn.removeEventListener('click', btn.nextClick);
        
        btn.nextClick = function() {
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.dataset.mode;
            const sessionLengthControl = document.getElementById('sessionLengthControl');
            
            if (mode === 'countdown') {
                sessionLengthControl.style.display = 'block';
                if (!isTimerRunning) {
                    timeRemaining = parseInt(sessionLength.value) * 60;
                    updateTimerDisplay();
                }
            } else {
                sessionLengthControl.style.display = 'none';
                if (!isTimerRunning) {
                    timeRemaining = 0;
                    sessionElapsedTime = 0;
                    updateTimerDisplay();
                }
            }
        };
        btn.addEventListener('click', btn.nextClick);
    });

    // Timer buttons
    startBtn.nextStartBtn = startTimer;
    pauseBtn.nextPauseBtn = pauseTimer;
    stopBtn.nextStopBtn = stopTimer;

    startBtn.addEventListener('click', startBtn.nextStartBtn);
    pauseBtn.addEventListener('click', pauseBtn.nextPauseBtn);
    stopBtn.addEventListener('click', stopBtn.nextStopBtn);

    // Custom timer button
    const customBtn = document.getElementById('setCustomBtn');
    const customInput = document.getElementById('customMinutes');
    if (customBtn && customInput) {
        if (customBtn.nextClick) customBtn.removeEventListener('click', customBtn.nextClick);
        customBtn.nextClick = function() {
            const customValue = parseInt(customInput.value);
            if (customValue && customValue > 0 && customValue <= 180) {
                timeRemaining = customValue * 60;
                sessionTotalSeconds = customValue * 60;
                updateTimerDisplay();
                customInput.value = '';
            } else {
                alert('Please enter a value between 1 and 180 minutes');
            }
        };
        customBtn.addEventListener('click', customBtn.nextClick);
    }

    // distraction controls
    const incrD = document.getElementById('incrDistraction');
    const decrD = document.getElementById('decrDistraction');
    const dCount = document.getElementById('distractionCount');
    if (incrD) {
        if (incrD.nextClick) incrD.removeEventListener('click', incrD.nextClick);
        incrD.nextClick = () => { 
            distractionCount++; 
            if (dCount) dCount.textContent = distractionCount; 
        };
        incrD.addEventListener('click', incrD.nextClick);
    }
    if (decrD) {
        if (decrD.nextClick) decrD.removeEventListener('click', decrD.nextClick);
        decrD.nextClick = () => { 
            distractionCount = Math.max(0, distractionCount - 1); 
            if (dCount) dCount.textContent = distractionCount; 
        };
        decrD.addEventListener('click', decrD.nextClick);
    }

    // Star rating
    if (starRating) {
        if (starRating.nextClick) starRating.removeEventListener('click', starRating.nextClick);
        
        starRating.nextClick = function(e) {
            if (e.target.tagName === 'I') {
                sessionRating = parseInt(e.target.dataset.rating);
                
                const stars = starRating.querySelectorAll('i');
                stars.forEach((star, index) => {
                    if (index < sessionRating) {
                        star.classList.add('selected');
                    } else {
                        star.classList.remove('selected');
                    }
                });

                const ratingText = document.getElementById('ratingText');
                const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
                ratingText.textContent = labels[sessionRating];
            }
        };
        starRating.addEventListener('click', starRating.nextClick);
    }

    // Distraction tags
    document.querySelectorAll('.tag-btn').forEach(btn => {
        if (btn.nextClick) btn.removeEventListener('click', btn.nextClick);
        
        btn.nextClick = function() {
            this.classList.toggle('selected');
            const tag = this.dataset.tag;
            
            if (this.classList.contains('selected')) {
                sessionTags.add(tag);
            } else {
                sessionTags.delete(tag);
            }
        };
        btn.addEventListener('click', btn.nextClick);
    });

    // Save session
    const saveSessionBtn = document.getElementById('saveSessionBtn');
    const skipBtn = document.getElementById('skipBtn');
    
    if (saveSessionBtn) {
        if (saveSessionBtn.nextClick) saveSessionBtn.removeEventListener('click', saveSessionBtn.nextClick);
        
        saveSessionBtn.nextClick = function() {
            const notes = document.getElementById('sessionNotes').value;
            
            if (!selectedTaskName || sessionRating === 0) {
                alert('Please select a task and rating');
                return;
            }

            DB.addSession({
                taskName: selectedTaskName,
                project: DB.getTasks().find(t => t.name === selectedTaskName)?.project || 'Unknown',
                duration: sessionElapsedTime > 0 ? Math.round(sessionElapsedTime / 60) : Math.round(sessionTotalSeconds / 60),
                rating: sessionRating,
                tags: Array.from(sessionTags),
                distractions: distractionCount,
                notes: notes
            });

            // Update task focus time
            const task = DB.getTasks().find(t => t.name === selectedTaskName);
            if (task) {
                const addedHours = (sessionElapsedTime > 0 ? sessionElapsedTime / 3600 : sessionTotalSeconds / 3600);
                DB.updateTask(task.id, {
                    focusTime: task.focusTime + addedHours,
                    status: 'In Progress'
                });
            }

            alert('Session saved successfully!');
            distractionCount = 0;
            closeSessionModal();
            loadDashboardData();
            loadTasksPage();
            loadHistoryData();
        };
        saveSessionBtn.addEventListener('click', saveSessionBtn.nextClick);
    }

    if (skipBtn) {
        if (skipBtn.nextClick) skipBtn.removeEventListener('click', skipBtn.nextClick);
        skipBtn.nextClick = closeSessionModal;
        skipBtn.addEventListener('click', skipBtn.nextClick);
    }
}

function startTimer() {
    if (!selectedTaskName) {
        alert('Please select a task first');
        return;
    }

    if (!isTimerRunning) {
        isTimerRunning = true;
        sessionStartTime = Date.now() - (sessionElapsedTime * 1000);
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const sessionLength = document.getElementById('sessionLength');
        const mode = document.querySelector('.mode-btn.active')?.dataset.mode || 'countdown';

        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = false;
        if (sessionLength) sessionLength.disabled = true;

        // capture total seconds for progress calculations
        if (mode === 'countdown') {
            sessionTotalSeconds = parseInt(sessionLength.value) * 60;
        } else {
            // arbitrary cap for flow visual (1 hour)
            sessionTotalSeconds = 3600;
        }

        // Capture mode in closure to ensure correct behavior
        timerInterval = setInterval(() => {
            const currentMode = document.querySelector('.mode-btn.active')?.dataset.mode || 'countdown';
            
            if (currentMode === 'countdown') {
                timeRemaining--;
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    timeRemaining = 0;
                    showSessionComplete();
                    return;
                }
            } else {
                sessionElapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
            }
            updateTimerDisplay();
            updateProjectDisplay();
        }, 1000);
        
        updateTimerDisplay();
        updateProjectDisplay();
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        isTimerRunning = false;
        clearInterval(timerInterval);
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }
        if (pauseBtn) pauseBtn.disabled = true;
    }
}

function stopTimer() {
    if (isTimerRunning || timerInterval) {
        isTimerRunning = false;
        clearInterval(timerInterval);
        showSessionComplete();
    }
}

function formatDisplayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const flowTimer = document.getElementById('flowTimerDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const modeBtn = document.querySelector('.mode-btn.active');
    const mode = modeBtn?.dataset.mode || 'countdown';
    let displayTime;

    if (mode === 'countdown') {
        displayTime = formatDisplayTime(timeRemaining);
    } else {
        displayTime = formatDisplayTime(sessionElapsedTime);
    }

    // update both old and new displays if present
    if (flowTimer) flowTimer.textContent = displayTime;
    if (timerDisplay) timerDisplay.textContent = displayTime;

    // update progress ring
    const ring = document.querySelector('.ring');
    if (ring && sessionTotalSeconds > 0) {
        const covered = mode === 'countdown' ? (sessionTotalSeconds - timeRemaining) : sessionElapsedTime;
        const pct = Math.max(0, Math.min(1, covered / sessionTotalSeconds));
        const circumference = 2 * Math.PI * 96; // r=96
        ring.style.strokeDashoffset = String(Math.round(circumference * (1 - pct)));
    }

    // update flow meter (simple heuristics: higher sessionElapsedTime => higher 'flow')
    const meterFill = document.querySelector('.meter-fill');
    if (meterFill) {
        const val = Math.min(100, Math.round((mode === 'countdown' ? (sessionTotalSeconds - timeRemaining) : sessionElapsedTime) / sessionTotalSeconds * 100));
        meterFill.style.width = val + '%';
    }

    // update distraction count display
    const dCount = document.getElementById('distractionCount');
    if (dCount) dCount.textContent = distractionCount;
}

function updateProjectDisplay() {
    const projectDisplay = document.getElementById('projectDisplay');
    const endTimeDisplay = document.getElementById('endTimeDisplay');
    const breakDisplay = document.getElementById('breakDisplay');

    if (selectedTaskName) {
        // Get the task's project
        const task = DB.getTasks().find(t => t.name === selectedTaskName);
        const projectName = task ? task.project : 'Unknown';
        projectDisplay.textContent = projectName;

        // Calculate and show expected end time
        if (isTimerRunning) {
            const mode = document.querySelector('.mode-btn.active')?.dataset.mode || 'countdown';
            if (mode === 'countdown') {
                const endTime = new Date(Date.now() + timeRemaining * 1000);
                endTimeDisplay.textContent = endTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // Calculate break time
                const breakMinutes = timeRemaining > 1800 ? 15 : 5; // 15 min if session > 30min, else 5 min
                const breakTime = new Date(Date.now() + (timeRemaining + breakMinutes * 60) * 1000);
                breakDisplay.textContent = `${breakMinutes} min at ${breakTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
            } else {
                // Flowtime mode - show estimated end
                const estimatedEnd = new Date(Date.now() + 3600 * 1000); // 1 hour estimate
                endTimeDisplay.textContent = estimatedEnd.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                breakDisplay.textContent = 'After this session';
            }
        } else {
            endTimeDisplay.textContent = '-';
            breakDisplay.textContent = 'After this session';
        }
    } else {
        projectDisplay.textContent = '-';
        endTimeDisplay.textContent = '-';
        breakDisplay.textContent = 'After this session';
    }
}

function showSessionComplete() {
    const sessionModal = document.getElementById('sessionModal');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (sessionModal) sessionModal.style.display = 'flex';
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
}

function closeSessionModal() {
    const sessionModal = document.getElementById('sessionModal');
    if (sessionModal) sessionModal.style.display = 'none';
    resetTimer();
}

function resetTimer() {
    timeRemaining = parseInt(document.getElementById('sessionLength').value) * 60;
    sessionElapsedTime = 0;
    sessionStartTime = null;
    sessionRating = 0;
    sessionTags.clear();
    selectedTaskName = null;
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const sessionLength = document.getElementById('sessionLength');

    if (startBtn) {
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    }
    if (pauseBtn) pauseBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
    if (sessionLength) sessionLength.disabled = false;

    // Reset star rating
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.classList.remove('selected');
    });

    // Reset tags
    document.querySelectorAll('.tag-btn').forEach(tag => {
        tag.classList.remove('selected');
    });

    // Reset notes
    const sessionNotes = document.getElementById('sessionNotes');
    if (sessionNotes) sessionNotes.value = '';

    updateTimerDisplay();
    updateProjectDisplay();
}

// ============================================
// 7. HISTORY PAGE
// ============================================

function loadHistoryData() {
    const sessions = DB.getSessions();
    const today = new Date().toDateString();

    // Group sessions by day
    const groupedByDay = {};
    sessions.forEach(session => {
        const dateStr = new Date(session.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!groupedByDay[dateStr]) {
            groupedByDay[dateStr] = [];
        }
        groupedByDay[dateStr].push(session);
    });

    // Render history
    const sessionsHistory = document.querySelector('.sessions-grouped');
    if (sessionsHistory) {
        sessionsHistory.innerHTML = Object.entries(groupedByDay)
            .reverse()
            .map(([date, daySessions]) => `
                <div class="day-group">
                    <h4>${date}</h4>
                    ${daySessions.map(session => `
                        <div class="session-row">
                            <div class="session-main">
                                <p class="session-task">${session.taskName}</p>
                                <p class="session-duration">${session.duration} min</p>
                            </div>
                            <div class="session-rating-small">
                                ${Array(5).fill(0).map((_, i) => 
                                    i < session.rating 
                                        ? '<i class="fas fa-star" style="color: #fbbf24;"></i>'
                                        : '<i class="fas fa-star" style="color: #d1d5db;"></i>'
                                ).join('')}
                            </div>
                            <button class="btn btn-sm btn-secondary" title="${session.notes}">
                                <i class="fas fa-note-sticky"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `).join('');
    }

    // Update insights
    updateInsights(sessions);
}

function updateInsights(sessions) {
    if (sessions.length === 0) {
        // Hide insights if no sessions
        const insightsColumn = document.querySelector('.insights-column');
        if (insightsColumn) insightsColumn.style.display = 'none';
        return;
    }

    // Show insights if they exist
    const insightsColumn = document.querySelector('.insights-column');
    if (insightsColumn) insightsColumn.style.display = 'flex';

    // Best focus time (most sessions in a time range)
    const hoursMap = {};
    sessions.forEach(s => {
        const hour = new Date(s.date).getHours();
        hoursMap[hour] = (hoursMap[hour] || 0) + 1;
    });
    const bestHour = parseInt(Object.keys(hoursMap).reduce((a, b) => hoursMap[a] > hoursMap[b] ? a : b));
    const nextHour = (bestHour + 1) % 24;
    const formatHour = (h) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:00 ${period}`;
    };
    const bestFocusRange = `${formatHour(bestHour)} - ${formatHour(nextHour)}`;

    // Average session length
    const avgLength = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length);

    // Most focused day (highest avg rating)
    const dayRatings = {};
    const dayCounts = {};
    sessions.forEach(s => {
        const day = new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' });
        dayRatings[day] = (dayRatings[day] || 0) + s.rating;
        dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const mostFocusedDay = Object.keys(dayRatings).reduce((a, b) => 
        (dayRatings[a] / dayCounts[a]) > (dayRatings[b] / dayCounts[b]) ? a : b
    );
    const avgRating = (dayRatings[mostFocusedDay] / dayCounts[mostFocusedDay]).toFixed(1);

    // Total this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSessions = sessions.filter(s => new Date(s.date) >= monthStart);
    const totalMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;

    // Update insight cards
    const insightCards = document.querySelectorAll('.insight-card');
    if (insightCards.length >= 4) {
        insightCards[0].querySelector('.insight-value').textContent = bestFocusRange;
        insightCards[1].querySelector('.insight-value').textContent = `${avgLength} min`;
        insightCards[2].querySelector('.insight-value').textContent = mostFocusedDay;
        insightCards[2].querySelector('.insight-text').textContent = `Avg rating: ${avgRating} / 5 stars`;
        insightCards[3].querySelector('.insight-value').textContent = `${totalHours}h ${String(totalMins).padStart(2, '0')}m`;
        insightCards[3].querySelector('.insight-text').textContent = `${monthSessions.length} sessions completed`;
    }
}

// ============================================
// 7. HELPER FUNCTIONS
// ============================================

function saveProfile() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const avatarInput = document.getElementById('avatar');

    // Validate inputs
    if (!fullName.trim() || !email.trim()) {
        alert('Please fill in all fields');
        return;
    }

    // Save profile data to localStorage
    const profileData = {
        fullName: fullName,
        email: email
    };

    // Handle avatar upload if a file is selected
    if (avatarInput.files && avatarInput.files[0]) {
        const file = avatarInput.files[0];

        // Validate file type and size
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPG or PNG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert('File size must be less than 2MB');
            return;
        }

        // Read file as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            profileData.avatarUrl = e.target.result;
            localStorage.setItem('flowstate_profile', JSON.stringify(profileData));
            updateAvatarDisplay(profileData.avatarUrl);
            alert('Profile updated successfully!');
            avatarInput.value = ''; // Clear the input
        };
        reader.readAsDataURL(file);
    } else {
        // Save without avatar update
        localStorage.setItem('flowstate_profile', JSON.stringify(profileData));
        alert('Profile updated successfully!');
    }
}

function updateAvatarDisplay(avatarUrl) {
    const avatarImg = document.querySelector('.user-avatar img');
    if (avatarImg) {
        avatarImg.src = avatarUrl;
    }
}

function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('flowstate_profile'));
    if (profileData) {
        if (profileData.fullName) {
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput) fullNameInput.value = profileData.fullName;
        }
        if (profileData.email) {
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.value = profileData.email;
        }
        if (profileData.avatarUrl) {
            updateAvatarDisplay(profileData.avatarUrl);
        }
    }
}

function selectTaskAndFocus(taskName) {
    const taskSelect = document.getElementById('taskSelect');
    if (taskSelect) {
        taskSelect.value = taskName;
        selectedTaskName = taskName;
        updateProjectDisplay();
    }
    navigateToPage('focus');
}

// ============================================
// 8. CHARTS
// ============================================

let focusByDayChart = null;
let timeByProjectChart = null;
let sessionTrendChart = null;
let sessionDistChart = null;

function initializeCharts() {
    const focusCtx = document.getElementById('focusByDayChart');
    const projectCtx = document.getElementById('timeByProjectChart');

    if (focusCtx) {
        focusByDayChart = new Chart(focusCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours',
                    data: [2.5, 3.2, 4.0, 3.5, 2.8, 0.5, 0],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(229, 231, 235, 0.5)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    if (projectCtx) {
        timeByProjectChart = new Chart(projectCtx, {
            type: 'doughnut',
            data: {
                labels: ['Design System', 'Development', 'Documentation', 'Testing'],
                datasets: [{
                    data: [12.5, 8.75, 3.33, 5.25],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Session trend chart (line)
    const trendCtx = document.getElementById('sessionTrendChart');
    if (trendCtx) {
        sessionTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sessions',
                    data: [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }

    // Session duration distribution (bar)
    const distCtx = document.getElementById('sessionDistChart');
    if (distCtx) {
        sessionDistChart = new Chart(distCtx, {
            type: 'bar',
            data: {
                labels: ['0-15', '16-30', '31-45', '46-60', '60+'],
                datasets: [{
                    label: 'Count',
                    data: [0,0,0,0,0],
                    backgroundColor: '#ef4444'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
}

// ============================================
// 9. EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Reset data (clear all, reinitialize defaults)
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', showResetConfirm);
    }

    // Delete data confirmation
    const deleteDataBtn = document.getElementById('deleteDataBtn');
    if (deleteDataBtn) {
        deleteDataBtn.addEventListener('click', showDeleteConfirm);
    }

    // Confirmation dialog buttons
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmCancel = document.getElementById('confirmCancel');
    const confirmYes = document.getElementById('confirmYes');

    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            confirmDialog.style.display = 'none';
        });
    }

    // Settings form handlers
    const saveProfileBtn = document.querySelector('.settings-section:nth-child(1) .btn-primary');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }

    const savePreferencesBtn = document.querySelector('.settings-section:nth-child(2) .btn-primary');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', () => {
            alert('Preferences saved successfully!');
        });
    }

    // Export data button
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportData();
        });
    }
}

function exportData() {
    const data = {
        tasks: DB.getTasks(),
        sessions: DB.getSessions(),
        projects: DB.getProjects(),
        settings: { theme: getTheme() }
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowstate-export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function showResetConfirm() {
    const confirmDialog = document.getElementById('confirmDialog');
    document.getElementById('confirmTitle').textContent = 'Reset to Defaults?';
    document.getElementById('confirmMessage').textContent =
        'This will clear all your data and reinitialize with sample projects. You will start fresh.';
    
    // Change the confirm button to show "Reset"
    const confirmYes = document.getElementById('confirmYes');
    if (confirmYes) {
        confirmYes.textContent = 'Reset';
        // Remove previous listeners by cloning
        const newConfirmYes = confirmYes.cloneNode(true);
        confirmYes.parentNode.replaceChild(newConfirmYes, confirmYes);
        newConfirmYes.addEventListener('click', () => {
            localStorage.clear();
            localStorage.removeItem('flowstate_initialized');
            location.reload();
        });
    }
    confirmDialog.style.display = 'flex';
}

function showDeleteConfirm() {
    const confirmDialog = document.getElementById('confirmDialog');
    document.getElementById('confirmTitle').textContent = 'Delete All Data?';
    document.getElementById('confirmMessage').textContent =
        'This action is permanent and cannot be undone. All your sessions and data will be deleted.';
    
    // Reset button back to "Delete"
    const confirmYes = document.getElementById('confirmYes');
    if (confirmYes) {
        confirmYes.textContent = 'Delete';
        // Remove previous listeners by cloning
        const newConfirmYes = confirmYes.cloneNode(true);
        confirmYes.parentNode.replaceChild(newConfirmYes, confirmYes);
        newConfirmYes.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        });
    }
    confirmDialog.style.display = 'flex';
}

// ============================================
// 10. THEME PERSISTENCE
// ============================================

function setTheme(themeName) {
    // themeName: 'dark' | 'light' | 'system'
    if (themeName === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (themeName === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        // system - remove explicit attribute so CSS media query handles it
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', themeName);
}

function getTheme() {
    return localStorage.getItem('theme') || 'system';
}

// Initialize theme
const initTheme = () => {
    const theme = getTheme();
    setTheme(theme);
    
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.value = theme;
        themeSelect.addEventListener('change', (e) => {
            setTheme(e.target.value);
        });
    }
};


// Call after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// ============================================
// 11. UTILITY FUNCTIONS
// ============================================

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
