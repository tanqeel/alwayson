'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './dashboard.module.css';
import { getTasks, addTask, toggleTask, deleteTask, getHabits, toggleHabit, getStreak, updateStreak, getSettings } from '@/lib/storage';
import { getPrayerTimes, getNextPrayer, getIslamicGreeting } from '@/lib/prayerTimes';

const HABIT_CONFIG = [
    { key: 'fajr', label: 'Fajr', icon: '🌙' },
    { key: 'dhuhr', label: 'Dhuhr', icon: '☀️' },
    { key: 'asr', label: 'Asr', icon: '🌤️' },
    { key: 'maghrib', label: 'Maghrib', icon: '🌅' },
    { key: 'isha', label: 'Isha', icon: '🌃' },
    { key: 'quran', label: 'Quran', icon: '📖' },
    { key: 'study', label: 'Study', icon: '📚' },
    { key: 'exercise', label: 'Exercise', icon: '💪' },
    { key: 'sleep_early', label: 'Early Sleep', icon: '😴' },
];

const DAILY_HADITH = [
    { text: "The best of deeds are those done consistently, even if small.", source: "Sahih Bukhari" },
    { text: "Take advantage of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before becoming busy, and your life before death.", source: "Shu'ab al-Iman" },
    { text: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.", source: "Sahih Muslim" },
    { text: "The strong person is not the one who can wrestle, but the one who controls himself at times of anger.", source: "Sahih Bukhari" },
    { text: "Make things easy, do not make them difficult. Give glad tidings and do not drive people away.", source: "Sahih Bukhari" },
    { text: "Allah loves that when one of you does a deed, he does it with excellence (Ihsan).", source: "At-Tabarani" },
    { text: "Verily, with hardship comes ease.", source: "Quran 94:6" },
];

export default function DashboardPage() {
    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState({});
    const [streak, setStreak] = useState({ current: 0, best: 0 });
    const [newTask, setNewTask] = useState('');
    const [prayerData, setPrayerData] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [greeting, setGreeting] = useState({ greeting: '', subtitle: '' });
    const [todayHadith, setTodayHadith] = useState(DAILY_HADITH[0]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTasks(getTasks());
        setHabits(getHabits());
        setStreak(updateStreak());
        setGreeting(getIslamicGreeting());
        setTodayHadith(DAILY_HADITH[new Date().getDay() % DAILY_HADITH.length]);

        const settings = getSettings();
        getPrayerTimes(settings.city, settings.country).then((data) => {
            if (data) {
                setPrayerData(data);
                setNextPrayer(getNextPrayer(data));
            }
        });

        // Update next prayer every minute
        const interval = setInterval(() => {
            if (prayerData) {
                setNextPrayer(getNextPrayer(prayerData));
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleAddTask = useCallback((e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const updated = addTask({ text: newTask.trim() });
        setTasks(updated);
        setNewTask('');
    }, [newTask]);

    const handleToggleTask = useCallback((id) => {
        setTasks(toggleTask(id));
    }, []);

    const handleDeleteTask = useCallback((id) => {
        setTasks(deleteTask(id));
    }, []);

    const handleToggleHabit = useCallback((key) => {
        setHabits(toggleHabit(key));
    }, []);

    if (!mounted) return null;

    const completedHabits = Object.values(habits).filter(Boolean).length;
    const totalHabits = HABIT_CONFIG.length;
    const habitProgress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="page container">
            {/* Header with greeting */}
            <div className={`${styles.header} animate-fade-in-up`}>
                <div>
                    <p className={styles.greeting}>{greeting.greeting}</p>
                    <p className={styles.subtitle}>{greeting.subtitle}</p>
                    <p className={styles.date}>{dateStr}</p>
                    {prayerData && (
                        <p className={styles.hijriDate}>
                            {prayerData.hijriDay} {prayerData.hijriMonth} {prayerData.hijriYear} AH
                        </p>
                    )}
                </div>
                <div className={styles.streakBadge}>
                    <span className={styles.streakNumber}>{streak.current}</span>
                    <span className={styles.streakLabel}>day streak</span>
                </div>
            </div>

            {/* Next Prayer Widget */}
            {nextPrayer && (
                <div className={`${styles.prayerWidget} card animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
                    <div className={styles.prayerLeft}>
                        <span className={styles.prayerIcon}>🕌</span>
                        <div>
                            <p className={styles.prayerLabel}>Next Prayer</p>
                            <p className={styles.prayerName}>{nextPrayer.name}</p>
                        </div>
                    </div>
                    <div className={styles.prayerRight}>
                        <p className={styles.prayerTime}>{nextPrayer.time}</p>
                        <p className={styles.prayerCountdown}>in {nextPrayer.countdown}</p>
                    </div>
                </div>
            )}

            {/* Daily Progress Overview */}
            <div className={`${styles.progressSection} card animate-fade-in-up`} style={{ animationDelay: '0.15s' }}>
                <div className="card-header">
                    <span className="card-title">Today&apos;s Consistency</span>
                    <span className={`badge ${habitProgress >= 70 ? 'badge-emerald' : habitProgress >= 40 ? 'badge-amber' : 'badge-red'}`}>
                        {habitProgress}%
                    </span>
                </div>
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${habitProgress}%` }} />
                </div>
                <p className={styles.progressNote}>
                    {completedHabits}/{totalHabits} habits · {completedTasks}/{tasks.length} tasks
                </p>
            </div>

            {/* Habits Grid */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                <p className="section-title">Daily Non-Negotiables</p>
                <div className={styles.habitsGrid}>
                    {HABIT_CONFIG.map((habit) => (
                        <button
                            key={habit.key}
                            className={`${styles.habitChip} ${habits[habit.key] ? styles.habitDone : ''}`}
                            onClick={() => handleToggleHabit(habit.key)}
                        >
                            <span className={styles.habitIcon}>{habit.icon}</span>
                            <span className={styles.habitLabel}>{habit.label}</span>
                            {habits[habit.key] && (
                                <svg className={styles.habitCheck} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tasks */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.25s' }}>
                <p className="section-title">Today&apos;s Tasks</p>

                <form onSubmit={handleAddTask} className={styles.taskForm}>
                    <input
                        type="text"
                        placeholder="Add a task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className={styles.taskInput}
                    />
                    <button type="submit" className={`btn btn-primary ${styles.taskAddBtn}`}>
                        +
                    </button>
                </form>

                <div className={styles.taskList}>
                    {tasks.length === 0 ? (
                        <div className={styles.emptyTasks}>
                            <p>No tasks yet. Add your first non-negotiable.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.taskDone : ''}`}>
                                <button
                                    className={styles.taskCheckbox}
                                    onClick={() => handleToggleTask(task.id)}
                                >
                                    {task.completed ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-emerald)" stroke="var(--accent-emerald)" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="4" fill="var(--accent-emerald)" opacity="0.2" />
                                            <path d="M9 12l2 2 4-4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="4" />
                                        </svg>
                                    )}
                                </button>
                                <span className={styles.taskText}>{task.text}</span>
                                <button className={styles.taskDelete} onClick={() => handleDeleteTask(task.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Daily Hadith */}
            <div className={`animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
                <p className="section-title">Daily Reminder</p>
                <div className="islamic-quote">
                    <p>&ldquo;{todayHadith.text}&rdquo;</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                        — {todayHadith.source}
                    </p>
                </div>
            </div>
        </div>
    );
}
