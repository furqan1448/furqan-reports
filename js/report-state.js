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
    return payload;
  } catch (e) {
    console.error("خطأ في الحفظ المحلي:", e);
  }
}

export function loadReportState() {
  try {
    const key = getReportStorageKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("خطأ في قراءة التقرير:", e);
    return null;
  }
}

export function clearReportState() {
  try {
    const key = getReportStorageKey();
    localStorage.removeItem(key);
  } catch (e) {
    console.error("خطأ في مسح البيانات:", e);
  }
}
