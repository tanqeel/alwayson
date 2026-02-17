/* ============================================
   localStorage helpers for AlwaysOn
   ============================================ */

const PREFIX = 'alwayson_';

export function getItem(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function setItem(key, value) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
        console.warn('AlwaysOn: localStorage write failed', e);
    }
}

export function removeItem(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PREFIX + key);
}

/* ---- Task helpers ---- */
export function getTasks() {
    return getItem('tasks', []);
}

export function saveTasks(tasks) {
    setItem('tasks', tasks);
}

export function addTask(task) {
    const tasks = getTasks();
    tasks.push({
        id: Date.now().toString(),
        text: task.text,
        category: task.category || 'general',
        completed: false,
        createdAt: new Date().toISOString(),
    });
    saveTasks(tasks);
    return tasks;
}

export function toggleTask(id) {
    const tasks = getTasks().map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(tasks);
    return tasks;
}

export function deleteTask(id) {
    const tasks = getTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
    return tasks;
}

/* ---- Habit helpers ---- */
export function getHabits() {
    const today = new Date().toISOString().split('T')[0];
    return getItem(`habits_${today}`, {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
        quran: false,
        study: false,
        exercise: false,
        sleep_early: false,
    });
}

export function toggleHabit(habitKey) {
    const today = new Date().toISOString().split('T')[0];
    const habits = getHabits();
    habits[habitKey] = !habits[habitKey];
    setItem(`habits_${today}`, habits);
    return habits;
}

/* ---- Streak helpers ---- */
export function getStreak() {
    return getItem('streak', { current: 0, best: 0, lastDate: null });
}

export function updateStreak() {
    const streak = getStreak();
    const today = new Date().toISOString().split('T')[0];

    if (streak.lastDate === today) return streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastDate === yesterdayStr) {
        streak.current += 1;
    } else {
        streak.current = 1;
    }

    if (streak.current > streak.best) {
        streak.best = streak.current;
    }

    streak.lastDate = today;
    setItem('streak', streak);
    return streak;
}

/* ---- Settings helpers ---- */
export function getSettings() {
    return getItem('settings', {
        name: '',
        city: 'Islamabad',
        country: 'Pakistan',
        theme: 'dark',
        focusDuration: 25,
        breakDuration: 5,
    });
}

export function saveSettings(settings) {
    setItem('settings', settings);
}
