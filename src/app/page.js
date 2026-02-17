'use client';

import { useRouter } from 'next/navigation';
import styles from './welcome.module.css';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className={styles.welcome}>
      {/* Ambient glow */}
      <div className={styles.glow} />
      <div className={styles.glow2} />

      <div className={styles.content}>
        {/* Logo / System identity */}
        <div className={`${styles.logoSection} animate-fade-in-up`}>
          <div className={styles.logoIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.3" />
              <circle cx="24" cy="24" r="16" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.6" />
              <circle cx="24" cy="24" r="6" fill="var(--accent-emerald)" />
              <line x1="24" y1="2" x2="24" y2="10" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.5" />
              <line x1="24" y1="38" x2="24" y2="46" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.5" />
              <line x1="2" y1="24" x2="10" y2="24" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.5" />
              <line x1="38" y1="24" x2="46" y2="24" stroke="var(--accent-emerald)" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
          <h1 className={styles.title}>AlwaysOn</h1>
          <p className={styles.systemLabel}>LIFE OPERATING SYSTEM</p>
        </div>

        {/* Tagline */}
        <div className={`${styles.tagline} animate-fade-in-up`} style={{ animationDelay: '0.15s' }}>
          <p className={styles.taglineText}>
            &ldquo;Even when motivation is off,<br />
            <span className={styles.highlight}>the system stays on.</span>&rdquo;
          </p>
        </div>

        {/* Islamic foundation */}
        <div className={`${styles.islamicCard} animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
          <p className={styles.arabicText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className={styles.islamicCaption}>In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>

        {/* What this IS */}
        <div className={`${styles.pillars} animate-fade-in-up`} style={{ animationDelay: '0.45s' }}>
          <div className={styles.pillar}>
            <span className={styles.pillarIcon}>🕌</span>
            <span className={styles.pillarLabel}>Islamic-First</span>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarIcon}>⚡</span>
            <span className={styles.pillarLabel}>Discipline-Driven</span>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarIcon}>🤖</span>
            <span className={styles.pillarLabel}>Agentic AI</span>
          </div>
          <div className={styles.pillar}>
            <span className={styles.pillarIcon}>📊</span>
            <span className={styles.pillarLabel}>Consistency Engine</span>
          </div>
        </div>

        {/* What this is NOT */}
        <div className={`${styles.notSection} animate-fade-in-up`} style={{ animationDelay: '0.55s' }}>
          <p className={styles.notTitle}>This is NOT</p>
          <p className={styles.notText}>a productivity app, a planner, a habit tracker, or a motivation app.</p>
          <p className={styles.isText}>This is a <strong>Life Operating System</strong> that enforces consistency daily.</p>
        </div>

        {/* CTA */}
        <div className={`${styles.ctaSection} animate-fade-in-up`} style={{ animationDelay: '0.65s' }}>
          <button
            className={`btn btn-primary btn-full btn-lg ${styles.ctaBtn}`}
            onClick={() => router.push('/dashboard')}
          >
            Begin Your Journey
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <p className={styles.ctaNote}>Discipline is always active. Purpose is always remembered.</p>
        </div>
      </div>
    </div>
  );
}
