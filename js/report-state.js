import { auth } from './firebase/config.js';

// الحصول على المعرف الخاص بالموظفة المسجلة حالياً
export function getCurrentUserId() {
  const user = auth ? auth.currentUser : null;
  return user ? user.uid : 'default_user';
}

// مفتاح الحفظ المحلي المخصص لكل موظفة
export function getReportStorageKey() {
  const userId = getCurrentUserId();
  return `furqan_report_data_${userId}`;
}

// حفظ التقرير للموظفة الحالية فقط
export function saveReportState(data) {
  try {
    const key = getReportStorageKey();
    const reportData = {
      ...data,
      userId: getCurrentUserId(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(reportData));
    localStorage.setItem('furqan_report_data', JSON.stringify(reportData)); // للحفاظ على توافق الصفحة
    return reportData;
  } catch (e) {
    console.error("خطأ في حفظ البيانات محلياً:", e);
  }
}

// جلب تقرير الموظفة الحالية فقط
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

// مسح بيانات التقرير
export function clearReportState() {
  const key = getReportStorageKey();
  localStorage.removeItem(key);
  localStorage.removeItem('furqan_report_data');
}
