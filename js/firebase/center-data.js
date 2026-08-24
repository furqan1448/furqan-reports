import { db, auth } from './config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// حفظ التقرير في Firestore باسم مستند يساوي uid الموظفة
export async function saveCenterDataToFirebase(data) {
  const user = auth.currentUser;
  if (!user) throw new Error("يجب تسجيل الدخول أولاً");

  const reportRef = doc(db, "reports", user.uid);
  await setDoc(reportRef, {
    ...data,
    userId: user.uid,
    userEmail: user.email,
    updatedAt: new Date()
  }, { merge: true });
}

// جلب التقرير الخاص بالموظفة فقط من Firestore
export async function getCenterDataFromFirebase() {
  const user = auth.currentUser;
  if (!user) return null;

  const reportRef = doc(db, "reports", user.uid);
  const docSnap = await getDoc(reportRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}
