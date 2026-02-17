/* ============================================
   Aladhan Prayer Times API wrapper
   ============================================ */

const API_BASE = 'https://api.aladhan.com/v1';

/**
 * Get today's prayer times for a city
 */
export async function getPrayerTimes(city = 'Islamabad', country = 'Pakistan') {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        const res = await fetch(
            `${API_BASE}/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1`
        );
        const data = await res.json();

        if (data.code === 200 && data.data) {
            const timings = data.data.timings;
            return {
                Fajr: timings.Fajr,
                Sunrise: timings.Sunrise,
                Dhuhr: timings.Dhuhr,
                Asr: timings.Asr,
                Maghrib: timings.Maghrib,
                Isha: timings.Isha,
                date: data.data.date.readable,
                hijri: data.data.date.hijri.date,
                hijriMonth: data.data.date.hijri.month.en,
                hijriDay: data.data.date.hijri.day,
                hijriYear: data.data.date.hijri.year,
            };
        }
        return null;
    } catch (err) {
        console.error('Prayer times fetch failed:', err);
        return null;
    }
}

/**
 * Get the name and time of the next prayer
 */
export function getNextPrayer(timings) {
    if (!timings) return null;

    const now = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const name of prayers) {
        const [h, m] = timings[name].split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(h, m, 0, 0);

        if (now < prayerTime) {
            const diff = prayerTime - now;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            return {
                name,
                time: timings[name],
                countdown: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
                diff,
            };
        }
    }

    // After Isha — next is tomorrow's Fajr
    return {
        name: 'Fajr',
        time: timings.Fajr,
        countdown: 'Tomorrow',
        diff: 0,
    };
}

/**
 * Get Islamic greeting based on current time
 */
export function getIslamicGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return { greeting: 'Assalamu Alaikum', subtitle: 'Time for Tahajjud & reflection' };
    if (hour < 12) return { greeting: 'Assalamu Alaikum', subtitle: 'Start your day with Bismillah' };
    if (hour < 17) return { greeting: 'Assalamu Alaikum', subtitle: 'Stay focused on your tasks' };
    if (hour < 20) return { greeting: 'Assalamu Alaikum', subtitle: 'Evening of gratitude & review' };
    return { greeting: 'Assalamu Alaikum', subtitle: 'Plan tomorrow, rest well tonight' };
}
