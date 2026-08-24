import { auth } from './firebase/config.js';

// الحصول على المعرف الخاص بالموظفة المسجلة حالياً
export function getCurrentUserId() {
  const user = auth.currentUser;
  return user ? user.uid : 'guest';
}

// مفتاح الحفظ المحلي المخصص لكل موظفة
export function getReportStorageKey() {
  const userId = getCurrentUserId();
  return `furqan_report_data_${userId}`;
}

// حفظ التقرير للموظفة الحالية فقط
export function saveReportState(data) {
  const key = getReportStorageKey();
  const reportData = {
    ...data,
    userId: getCurrentUserId(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(reportData));
  return reportData;
}

// جلب تقرير الموظفة الحالية فقط
export function loadReportState() {
  const key = getReportStorageKey();
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
}

// مسح بيانات التقرير عند تسجل الخروج
export function clearReportState() {
  const key = getReportStorageKey();
  localStorage.removeItem(key);
}
