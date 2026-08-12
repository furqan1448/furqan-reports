export async function getOrCreateDraftReport(profile) {
  const cached = sessionStorage.getItem(SESSION_KEY);

  // 1) إذا كان عندنا رقم تقرير محفوظ في الجلسة
  if (cached) {
    const existing = await getDoc(
      doc(db, REPORTS_COLLECTION, cached)
    );

    if (
      existing.exists() &&
      existing.data().ownerUid === profile.uid
    ) {
      return cached;
    }
  }

  // 2) ابحث عن آخر تقرير محفوظ لهذه المستخدمة
  // وليس فقط المسودات
  const q = query(
    collection(db, REPORTS_COLLECTION),
    where("ownerUid", "==", profile.uid)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const reports = snap.docs
      .map(d => ({
        id: d.id,
        ...d.data(),
        updatedAtMs:
          d.data().updatedAt?.toMillis?.() || 0
      }))
      .sort(
        (a, b) =>
          b.updatedAtMs - a.updatedAtMs
      );

    // نأخذ آخر تقرير محفوظ
    const latestReport = reports[0];

    sessionStorage.setItem(
      SESSION_KEY,
      latestReport.id
    );

    return latestReport.id;
  }

  // 3) إذا لم يوجد أي تقرير نهائيًا، أنشئ مسودة جديدة
  const newDocRef = doc(
    collection(db, REPORTS_COLLECTION)
  );

  await setDoc(newDocRef, {
    ownerUid: profile.uid,
    ownerName: profile.name || "",
    status: "draft",

    basicData: {},
    goals: {},
    indicators: [],
    programs: [],
    measurementTools: [],
    resultsAnalysis: {},
    strengths: [],
    difficulties: [],
    improvementOpportunities: [],
    initiatives: [],
    impactStories: [],
    recommendations: [],
    nextPeriodPlan: [],
    evidence: [],
    reviewApproval: {},

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  sessionStorage.setItem(
    SESSION_KEY,
    newDocRef.id
  );

  return newDocRef.id;
}
