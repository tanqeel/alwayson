'use client';

import { useState, useEffect } from 'react';
import styles from './prayer.module.css';
import { getPrayerTimes, getNextPrayer } from '@/lib/prayerTimes';
import { getHabits, toggleHabit, getSettings } from '@/lib/storage';

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_NAMES = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };
const PRAYER_ARABIC = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
const PRAYER_ICONS = { fajr: '🌙', dhuhr: '☀️', asr: '🌤️', maghrib: '🌅', isha: '🌃' };

const DAILY_DUA = [
    { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', english: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and protect us from the punishment of the Fire.', reference: 'Quran 2:201' },
    { arabic: 'رَبِّ زِدْنِي عِلْمًا', english: 'My Lord, increase me in knowledge.', reference: 'Quran 20:114' },
    { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', english: 'Allah is sufficient for us, and He is the best disposer of affairs.', reference: 'Quran 3:173' },
    { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', english: 'My Lord, expand for me my chest and ease for me my task.', reference: 'Quran 20:25-26' },
    { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا', english: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.', reference: 'Ibn Majah' },
];

export default function PrayerPage() {
    const [mounted, setMounted] = useState(false);
    const [prayerData, setPrayerData] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [habits, setHabits] = useState({});
    const [todayDua, setTodayDua] = useState(DAILY_DUA[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        setHabits(getHabits());
        setTodayDua(DAILY_DUA[new Date().getDay() % DAILY_DUA.length]);

        const settings = getSettings();
        getPrayerTimes(settings.city, settings.country).then((data) => {
            if (data) {
                setPrayerData(data);
                setNextPrayer(getNextPrayer(data));
            }
            setLoading(false);
        });
    }, []);

    const handleTogglePrayer = (key) => {
        setHabits(toggleHabit(key));
    };

    if (!mounted) return null;

    const completedPrayers = PRAYER_KEYS.filter((k) => habits[k]).length;

    return (
        <div className="page container">
            <div className="page-header animate-fade-in-up">
                <h1>Prayer Hub</h1>
                <p className="subtitle">
                    {prayerData
                        ? `${prayerData.hijriDay} ${prayerData.hijriMonth} ${prayerData.hijriYear} AH`
                        : 'Connecting to prayer times...'}
                </p>
            </div>

            {/* Prayer completion */}
            <div className={`card ${styles.completionCard} animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
                <div className="card-header">
                    <span className="card-title">Prayer Tracker</span>
                    <span className={`badge ${completedPrayers === 5 ? 'badge-emerald' : 'badge-amber'}`}>
                        {completedPrayers}/5
                    </span>
                </div>
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${(completedPrayers / 5) * 100}%` }} />
                </div>
            </div>

            {/* Prayer times list */}
            <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.15s' }}>
                <p className="section-title">Today&apos;s Prayer Times</p>
                {loading ? (
                    <div className={styles.loading}>Loading prayer times...</div>
                ) : !prayerData ? (
                    <div className={styles.loading}>Unable to load prayer times. Check your city in Settings.</div>
                ) : (
                    <div className={styles.prayerList}>
                        {PRAYER_KEYS.map((key) => {
                            const isNext = nextPrayer && nextPrayer.name.toLowerCase() === key;
                            const isPrayed = habits[key];
                            return (
                                <div
                                    key={key}
                                    className={`${styles.prayerRow} ${isNext ? styles.nextPrayer : ''} ${isPrayed ? styles.prayed : ''}`}
                                >
                                    <div className={styles.prayerInfo}>
                                        <span className={styles.prayerIcon}>{PRAYER_ICONS[key]}</span>
                                        <div>
                                            <p className={styles.prayerName}>{PRAYER_NAMES[key]}</p>
                                            <p className={styles.prayerArabic}>{PRAYER_ARABIC[key]}</p>
                                        </div>
                                    </div>
                                    <div className={styles.prayerActions}>
                                        <span className={styles.prayerTime}>{prayerData[PRAYER_NAMES[key]]}</span>
                                        {isNext && !isPrayed && (
                                            <span className={styles.nextBadge}>NEXT</span>
                                        )}
                                        <button
                                            className={`${styles.prayerCheck} ${isPrayed ? styles.checked : ''}`}
                                            onClick={() => handleTogglePrayer(key)}
                                        >
                                            {isPrayed ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-emerald)" stroke="var(--accent-emerald)" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" fill="var(--accent-emerald)" opacity="0.2" />
                                                    <path d="M9 12l2 2 4-4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Additional times */}
            {prayerData && (
                <div className={`section animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                    <p className="section-title">Additional Times</p>
                    <div className={styles.additionalGrid}>
                        <div className={styles.additionalItem}>
                            <span className={styles.additionalLabel}>Sunrise</span>
                            <span className={styles.additionalTime}>{prayerData.Sunrise}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Daily Dua */}
            <div className={`animate-fade-in-up`} style={{ animationDelay: '0.25s' }}>
                <p className="section-title">Daily Du&apos;a</p>
                <div className={styles.duaCard}>
                    <p className={styles.duaArabic}>{todayDua.arabic}</p>
                    <p className={styles.duaEnglish}>&ldquo;{todayDua.english}&rdquo;</p>
                    <p className={styles.duaRef}>— {todayDua.reference}</p>
                </div>
            </div>
        </div>
    );
}
