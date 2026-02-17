'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './focus.module.css';
import { getSettings } from '@/lib/storage';

const MOTIVATIONAL_QUOTES = [
    "Consistency beats intensity. Show up daily.",
    "Discipline is choosing what you want most over what you want now.",
    "Small steps every day lead to big results.",
    "The system works when you work the system.",
    "Allah does not burden a soul beyond that it can bear. — Quran 2:286",
    "Verily, with hardship comes ease. — Quran 94:6",
    "The best of deeds are those done consistently. — Sahih Bukhari",
];

export default function FocusPage() {
    const [mounted, setMounted] = useState(false);
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [currentTask, setCurrentTask] = useState('');
    const [taskLocked, setTaskLocked] = useState(false);
    const [quote, setQuote] = useState('');
    const intervalRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const settings = getSettings();
        const fd = settings.focusDuration || 25;
        const bd = settings.breakDuration || 5;
        setFocusDuration(fd);
        setBreakDuration(bd);
        setTimeLeft(fd * 60);
        setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, []);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(intervalRef.current);
            if (!isBreak) {
                setSessions((prev) => prev + 1);
                setIsBreak(true);
                setTimeLeft(breakDuration * 60);
                setIsRunning(false);
                setTaskLocked(false);
            } else {
                setIsBreak(false);
                setTimeLeft(focusDuration * 60);
                setIsRunning(false);
            }
            setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft, isBreak, focusDuration, breakDuration]);

    const toggleTimer = useCallback(() => {
        if (!isRunning && !isBreak && currentTask.trim()) {
            setTaskLocked(true);
        }
        setIsRunning((prev) => !prev);
    }, [isRunning, isBreak, currentTask]);

    const resetTimer = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(focusDuration * 60);
        setTaskLocked(false);
    }, [focusDuration]);

    if (!mounted) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const totalTime = isBreak ? breakDuration * 60 : focusDuration * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const circumference = 2 * Math.PI * 120;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`page container ${styles.focusPage}`}>
            <div className="page-header" style={{ textAlign: 'center' }}>
                <h1>{isBreak ? 'Break Time' : 'Focus Mode'}</h1>
                <p className="subtitle">
                    {isBreak ? 'Rest, breathe, make dua.' : 'Lock in. No distractions.'}
                </p>
            </div>

            {/* Timer */}
            <div className={styles.timerContainer}>
                <svg className={styles.timerRing} viewBox="0 0 260 260">
                    <circle
                        cx="130" cy="130" r="120"
                        fill="none"
                        stroke="var(--bg-elevated)"
                        strokeWidth="6"
                    />
                    <circle
                        cx="130" cy="130" r="120"
                        fill="none"
                        stroke={isBreak ? 'var(--accent-amber)' : 'var(--accent-emerald)'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 130 130)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className={styles.timerContent}>
                    <p className={styles.timerDisplay}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </p>
                    <p className={styles.timerPhase}>{isBreak ? 'BREAK' : 'FOCUS'}</p>
                </div>
            </div>

            {/* Current Task */}
            <div className={styles.taskSection}>
                {taskLocked ? (
                    <div className={styles.lockedTask}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <span>{currentTask}</span>
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        value={currentTask}
                        onChange={(e) => setCurrentTask(e.target.value)}
                        className={styles.taskInput}
                        disabled={isRunning}
                    />
                )}
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <button
                    className={`btn ${isRunning ? styles.pauseBtn : 'btn-primary'} btn-lg`}
                    onClick={toggleTimer}
                >
                    {isRunning ? (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                            Pause
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            {timeLeft === totalTime ? 'Start' : 'Resume'}
                        </>
                    )}
                </button>
                <button className="btn btn-secondary" onClick={resetTimer}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                    Reset
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{sessions}</span>
                    <span className={styles.statLabel}>Sessions</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statNumber}>{sessions * focusDuration}</span>
                    <span className={styles.statLabel}>Minutes</span>
                </div>
            </div>

            {/* Motivational Quote */}
            <div className={styles.quoteCard}>
                <p>&ldquo;{quote}&rdquo;</p>
            </div>
        </div>
    );
}
