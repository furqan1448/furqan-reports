import { auth } from './firebase/config.js';

export function getCurrentUserId() {
  try {
    const user = auth ? auth.currentUser : null;
    return user ? user.uid : 'guest_user';
  } catch (e) {
    return 'guest_user';
  }
}

export function getReportStorageKey() {
  const userId = getCurrentUserId();
  return `furqan_report_data_${userId}`;
}

export function saveReportState(data) {
  try {
    const key = getReportStorageKey();
    const payload = {
      ...data,
      userId: getCurrentUserId(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem('furqan_report_data', JSON.stringify(payload));
    return payload;
  } catch (e) {
    console.error("خطأ في حفظ البيانات محلياً:", e);
  }
}

export function loadReportState() {
  try {
    const key = getReportStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);

    const fallback = localStorage.getItem('furqan_report_data');
    return fallback ? JSON.parse(fallback) : null;
  } catch (e) {
    console.error("خطأ في قراءة البيانات:", e);
    return null;
  }
}

export function clearReportState() {
  try {
    const key = getReportStorageKey();
    localStorage.removeItem(key);
    localStorage.removeItem('furqan_report_data');
  } catch (e) {
    console.error("خطأ في مسح البيانات:", e);
  }
}
