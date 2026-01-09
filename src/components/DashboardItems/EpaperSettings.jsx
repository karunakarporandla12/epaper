
import React, { useEffect, useMemo, useState } from "react";
import { auth, db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import SettingsLayout from "../../pages/settings/SettingsLayout";

const FALLBACK_UID = "7U6yUZmGSFVEYEBMdF0ySpoRD132";

const COUNTRIES = ["India", "United States", "United Kingdom", "Singapore"];
const LANGUAGES = ["en", "hi", "te", "ta", "kn"];
const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
];

const TopTabs = ({ active, setActive }) => {
  const tabs = [
    { key: "head", label: "Head Setup" },
    { key: "ga", label: "Google Analytics" },
    { key: "adsense", label: "Adsense TXT" },
    { key: "fbpixel", label: "Facebook Pixel Code" },
    { key: "heatmaps", label: "Heatmaps" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: active === t.key ? "#e8f1ff" : "white",
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

const Sidebar = ({ active, setActive }) => {
  const items = [
    { key: "basic", label: "Basic Setup" },
    { key: "seo", label: "SEO Setup" },
    { key: "social", label: "Social Pages" },
    { key: "push", label: "Push Notification" },
    { key: "watermark", label: "Watermark Setup" },
    { key: "recaptcha", label: "Google Recaptcha" },
  ];
  return (
    <div style={{ width: 240, borderRight: "1px solid #eee", padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 12 }}>SETTINGS</div>
      {items.map(it => (
        <div
          key={it.key}
          onClick={() => setActive(it.key)}
          style={{
            padding: "10px 12px",
            marginBottom: 6,
            borderRadius: 6,
            background: active === it.key ? "#f3f7ff" : "transparent",
            cursor: "pointer",
          }}
        >
          {it.label}
        </div>
      ))}
    </div>
  );
};

export default function EpaperSettings() {
  const [leftActive, setLeftActive] = useState("basic");
  const [topActive, setTopActive] = useState("head");

  const uid = useMemo(() => auth.currentUser?.uid || FALLBACK_UID, []);

  // Basic form state
  const [websiteName, setWebsiteName] = useState("");
  const [country, setCountry] = useState("India");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [language, setLanguage] = useState("en");
  const [creditBy, setCreditBy] = useState("");

  const [faviconFile, setFaviconFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Prefill latest saved doc from editions/{uid}/items ordered by updatedAt desc
  useEffect(() => {
    const loadLatest = async () => {
      try {
        const col = collection(db, "editions", uid, "items");
        const q = query(col, orderBy("updatedAt", "desc"), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setWebsiteName(data.websiteName ?? "");
          setCountry(data.country ?? "India");
          setTimezone(data.timezone ?? "Asia/Kolkata");
          setLanguage(data.language ?? "en");
          setCreditBy(data.creditBy ?? "");
          setFaviconPreview(data.faviconUrl ?? null);
          setLogoPreview(data.logoUrl ?? null);
        }
      } catch (err) {
        console.error("Failed to load latest settings", err);
      }
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const uploadIfPresent = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    const uploaded = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(uploaded.ref);
    return url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    // Basic validation
    if (!websiteName.trim()) {
      setMessage("Website Name is required.");
      return;
    }
    if (!timezone) {
      setMessage("Timezone is required.");
      return;
    }

    setSaving(true);
    try {
      // Build storage paths, preserve file extension if present
      const favExt = faviconFile?.name?.split(".").pop()?.toLowerCase() || "png";
      const logoExt = logoFile?.name?.split(".").pop()?.toLowerCase() || "png";

      const faviconUrl = await uploadIfPresent(
        faviconFile,
        `editions/${uid}/assets/favicon.${favExt}`
      );
      const logoUrl = await uploadIfPresent(
        logoFile,
        `editions/${uid}/assets/logo.${logoExt}`
      );

      const payload = {
        uid,
        websiteName,
        country,
        timezone,
        language,
        creditBy,
        faviconUrl: faviconUrl ?? faviconPreview ?? null,
        logoUrl: logoUrl ?? logoPreview ?? null,
        topTab: topActive, // optional: reflect which head tab context
        leftTab: leftActive,
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "editions", uid, "items"), payload);

      setMessage("Saved successfully.");
      if (faviconUrl) setFaviconPreview(faviconUrl);
      if (logoUrl) setLogoPreview(logoUrl);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fafafa" }}>
      {/* <Sidebar active={leftActive} setActive={setLeftActive} /> */}

      
     <SettingsLayout />
    </div>
  );
}
