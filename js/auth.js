// js/auth.js
// منطق تسجيل الدخول والتحقق من الجلسة، وربط المستخدمة بدورها من Firestore

import { auth, db } from "./firebase/config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { ROLE_LANDING_PAGE, roleLabel } from "./firebase/roles.js";

const APP_ROOT_URL = new URL("../", import.meta.url);
function loginPageUrl() {
  return new URL("login.html", APP_ROOT_URL).href;
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));
  if (!userDoc.exists()) {
    throw new Error("لا يوجد حساب مرتبط بهذا المستخدم في النظام. تواصلي مع إدارة النظام.");
  }
  return { uid: cred.user.uid, ...userDoc.data() };
}

export async function logout() {
  await signOut(auth);
  window.location.href = loginPageUrl();
}

export function requireAuth(onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = loginPageUrl();
      return;
    }
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await signOut(auth);
      window.location.href = loginPageUrl();
      return;
    }
    const profile = { uid: user.uid, ...userDoc.data() };
    onReady(profile);
  });
}

export function redirectByRole(profile) {
  const target = ROLE_LANDING_PAGE[profile.role] || "dashboard.html";
  window.location.href = target;
}

export { roleLabel };
