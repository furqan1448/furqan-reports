import { db, auth } from './config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// حفظ التقرير في Firestore باسم مستند يساوي uid الموظفة
export async function saveCenterDataToFirebase(data) {
  try {
    const user = auth ? auth.currentUser : null;
    if (!user) {
      console.warn("لم يتم تسجيل الدخول، سيتم الحفظ محلياً فقط.");
      return;
    }

    const reportRef = doc(db, "reports", user.uid);
    await setDoc(reportRef, {
      ...data,
      userId: user.uid,
      userEmail: user.email || '',
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("خطأ أثناء الحفظ في قاعدة البيانات:", error);
  }
}

// جلب التقرير الخاص بالموظفة فقط من Firestore
export async function getCenterDataFromFirebase() {
  try {
    const user = auth ? auth.currentUser : null;
    if (!user) return null;

    const reportRef = doc(db, "reports", user.uid);
    const docSnap = await getDoc(reportRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("خطأ أثناء جلب البيانات من قاعدة البيانات:", error);
    return null;
  }
}
