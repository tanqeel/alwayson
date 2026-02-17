'use client';

import { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { getSettings, saveSettings } from '@/lib/storage';

export default function SettingsPage() {
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState({
        name: '',
        city: 'Islamabad',
        country: 'Pakistan',
        theme: 'dark',
        focusDuration: 25,
        breakDuration: 5,
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setMounted(true);
        setSettings(getSettings());
    }, []);

    const handleChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        saveSettings(settings);

        // Apply theme
        document.documentElement.setAttribute('data-theme', settings.theme);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!mounted) return null;

    return (
        <div className="page container">
            <div className="page-header animate-fade-in-up">
                <h1>Settings</h1>
                <p className="subtitle">Minimal settings. Maximum discipline.</p>
            </div>

            {/* Profile */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
                <p className="section-title">Profile</p>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Name</label>
                    <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className={styles.input}
                    />
                </div>
            </div>

            {/* Location (for prayer times) */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.15s' }}>
                <p className="section-title">Location (for prayer times)</p>
                <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>City</label>
                        <input
                            type="text"
                            value={settings.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            placeholder="City"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Country</label>
                        <input
                            type="text"
                            value={settings.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            placeholder="Country"
                            className={styles.input}
                        />
                    </div>
                </div>
            </div>

            {/* Focus Timer */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                <p className="section-title">Focus Timer</p>
                <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Focus (minutes)</label>
                        <input
                            type="number"
                            min={5}
                            max={120}
                            value={settings.focusDuration}
                            onChange={(e) => handleChange('focusDuration', parseInt(e.target.value) || 25)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Break (minutes)</label>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            value={settings.breakDuration}
                            onChange={(e) => handleChange('breakDuration', parseInt(e.target.value) || 5)}
                            className={styles.input}
                        />
                    </div>
                </div>
            </div>

            {/* Theme */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.25s' }}>
                <p className="section-title">Appearance</p>
                <div className={styles.themeSelector}>
                    <button
                        className={`${styles.themeOption} ${settings.theme === 'dark' ? styles.themeActive : ''}`}
                        onClick={() => handleChange('theme', 'dark')}
                    >
                        <span className={styles.themeIcon}>🌙</span>
                        <span>Dark</span>
                    </button>
                    <button
                        className={`${styles.themeOption} ${settings.theme === 'light' ? styles.themeActive : ''}`}
                        onClick={() => handleChange('theme', 'light')}
                    >
                        <span className={styles.themeIcon}>☀️</span>
                        <span>Light</span>
                    </button>
                </div>
            </div>

            {/* Save */}
            <div className={`animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
                <button
                    className={`btn btn-primary btn-full ${styles.saveBtn} ${saved ? styles.saveBtnSaved : ''}`}
                    onClick={handleSave}
                >
                    {saved ? '✓ Saved' : 'Save Settings'}
                </button>
            </div>

            {/* System info */}
            <div className={`${styles.systemInfo} animate-fade-in-up`} style={{ animationDelay: '0.35s' }}>
                <p className={styles.version}>AlwaysOn v1.0.0 · MVP</p>
                <p className={styles.motto}>
                    &ldquo;We are not building an app. We are building a life operating system.&rdquo;
                </p>
                <p className={styles.islamic}>بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ</p>
            </div>
        </div>
    );
}
