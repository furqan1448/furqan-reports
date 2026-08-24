// إدارة حالة التقرير محلياً بحسب الحساب
export function saveReportState(data) {
  try {
    const user = window.firebaseAuth ? window.firebaseAuth.currentUser : null;
    const userId = user ? user.uid : 'default_user';
    const key = 'furqan_report_data_' + userId;
    
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem('furqan_report_data', JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function loadReportState() {
  try {
    const user = window.firebaseAuth ? window.firebaseAuth.currentUser : null;
    const userId = user ? user.uid : 'default_user';
    const key = 'furqan_report_data_' + userId;
    
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    
    const fallback = localStorage.getItem('furqan_report_data');
    return fallback ? JSON.parse(fallback) : null;
  } catch (e) {
    return null;
  }
}

export function clearReportState() {
  localStorage.removeItem('furqan_report_data');
}
