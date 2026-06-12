import { useState } from "react"
import axios from "axios"

const API = "https://maternal-health-ai-1.onrender.com"
const RISK_CONFIG = {
  "high risk": {
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    textBg: "#fee2e2",
    emoji: "🔴",
    label: "HIGH RISK",
    somali: "KHATAR SARE",
    action: "Go to a clinic or hospital TODAY — do not wait",
  },
  "mid risk": {
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    textBg: "#fef3c7",
    emoji: "🟡",
    label: "MEDIUM RISK",
    somali: "KHATAR DHEXDHEXAAD",
    action: "See a health worker within 3 days",
  },
  "low risk": {
    color: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    textBg: "#e0f2fe",
    emoji: "🟢",
    label: "LOW RISK",
    somali: "KHATAR HOOSE",
    action: "Continue regular prenatal checkups",
  },
}

export default function App() {
  const [page, setPage] = useState("home")
  const [vitals, setVitals] = useState({
    age: "", systolic_bp: "", diastolic_bp: "",
    blood_sugar: "", body_temp: "", heart_rate: ""
  })
  const [result, setResult] = useState(null)
  const [advice, setAdvice] = useState("")
  const [loading, setLoading] = useState(false)
  const [adviceLoading, setAdviceLoading] = useState(false)
  const [language, setLanguage] = useState("en")

  const labels = {
    en: {
      title: "Hooyo AI",
      subtitle: "Maternal Health Risk Advisor",
      tagline: "AI-powered pregnancy risk detection for Somalia & East Africa",
      start: "Check My Risk",
      learn: "How it works",
      form_title: "Enter Your Vital Signs",
      age: "Age (years)",
      sbp: "Systolic Blood Pressure",
      dbp: "Diastolic Blood Pressure",
      bs: "Blood Sugar (mmol/L)",
      temp: "Body Temperature (°F)",
      hr: "Heart Rate (bpm)",
      check: "Check Risk Level",
      checking: "Analyzing...",
      confidence: "Confidence",
      probabilities: "Risk Probabilities",
      get_advice: "Get Personalized Advice",
      getting: "Getting advice...",
      advice_title: "Your Health Advice",
      disclaimer: "This AI does not replace a real doctor. Always consult a health worker.",
      emergency: "Somalia Emergency: 888",
      back: "← Check Again",
    },
    so: {
      title: "Hooyo AI",
      subtitle: "Xulashada Khatarta Caafimaadka Hooyadnimada",
      tagline: "Ogaanshaha khatarta uurka ee Soomaaliya & Bariga Afrika",
      start: "Hubi Khatartayda",
      learn: "Sida u shaqaysa",
      form_title: "Gali Xogta Caafimaadkaaga",
      age: "Da'da (sano)",
      sbp: "Cadaadiska Dhiigga (Sare)",
      dbp: "Cadaadiska Dhiigga (Hoose)",
      bs: "Sonkorta Dhiigga (mmol/L)",
      temp: "Heerkulka Jirka (°F)",
      hr: "Garaaca Wadnaha (bpm)",
      check: "Hubi Heerka Khatarta",
      checking: "Falanqaynaya...",
      confidence: "Hubaal",
      probabilities: "Itimaalka Khatarta",
      get_advice: "Hel Talooyin Gaara",
      getting: "Helaya talooyin...",
      advice_title: "Talooyin Caafimaad",
      disclaimer: "Tani AI ma beddesho dhakhtar dhab ah. Mar walba la tasho shaqaale caafimaad.",
      emergency: "Lambarka Degdega Soomaaliya: 888",
      back: "← Dib u Hubin",
    }
  }

  const t = labels[language]

  const handleCheck = async () => {
    for (const key in vitals) {
      if (!vitals[key]) { alert("Please fill in all fields"); return }
    }
    setLoading(true)
    setResult(null)
    setAdvice("")
    try {
      const res = await axios.post(`${API}/predict`, {
        age: parseFloat(vitals.age),
        systolic_bp: parseFloat(vitals.systolic_bp),
        diastolic_bp: parseFloat(vitals.diastolic_bp),
        blood_sugar: parseFloat(vitals.blood_sugar),
        body_temp: parseFloat(vitals.body_temp),
        heart_rate: parseFloat(vitals.heart_rate),
      })
      setResult(res.data)
      setPage("result")
    } catch { alert("Something went wrong. Make sure backend is running.") }
    setLoading(false)
  }

  const handleGetAdvice = async () => {
    setAdviceLoading(true)
    try {
      const msg = language === "so" ? "Maxaan samayn karaa?" : "What should I do?"
      const res = await axios.post(`${API}/chat`, {
        message: msg,
        risk_level: result.risk_level,
        vitals: {
          age: parseFloat(vitals.age),
          systolic_bp: parseFloat(vitals.systolic_bp),
          diastolic_bp: parseFloat(vitals.diastolic_bp),
          blood_sugar: parseFloat(vitals.blood_sugar),
          body_temp: parseFloat(vitals.body_temp),
          heart_rate: parseFloat(vitals.heart_rate),
        }
      })
      setAdvice(res.data.reply)
    } catch { setAdvice("Could not get advice. Please try again.") }
    setAdviceLoading(false)
  }

  const riskConfig = result ? RISK_CONFIG[result.risk_level] : null

  const S = {
    page: { minHeight: "100vh", background: "#f1f5f9", color: "#0f172a", fontFamily: "'Inter', sans-serif" },
    nav: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    label: { fontSize: 12, color: "#64748b", display: "block", marginBottom: 6, fontWeight: 500 },
    input: { width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", color: "#0f172a", fontSize: 14, outline: "none", fontFamily: "inherit" },
    btnPrimary: { background: "linear-gradient(135deg, #0ea5e9, #0284c7)", color: "#fff", border: "none", borderRadius: 10, padding: "0.85rem 1.5rem", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(14,165,233,0.3)" },
    btnSecondary: { background: "#fff", color: "#0284c7", border: "1px solid #bae6fd", borderRadius: 10, padding: "0.85rem 1.5rem", fontWeight: 600, fontSize: 15, cursor: "pointer" },
    hint: { fontSize: 11, color: "#94a3b8", marginTop: 3, display: "block" },
  }

  // LANG TOGGLE
  const LangToggle = () => (
    <button onClick={() => setLanguage(language === "en" ? "so" : "en")}
      style={{ background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0284c7", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
      {language === "en" ? "🇸🇴 Somali" : "🇬🇧 English"}
    </button>
  )

  // ─── HOME PAGE ───
  if (page === "home") return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #0ea5e9, #0284c7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤱</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Hooyo <span style={{ color: "#0284c7" }}>AI</span></div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Maternal Health Advisor</div>
          </div>
        </div>
        <LangToggle />
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "4rem 1.5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "#0284c7", fontWeight: 600, marginBottom: "1.5rem" }}>
          <span style={{ width: 6, height: 6, background: "#0ea5e9", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }}></span>
          AI Summit Somalia 2026
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 7vw, 3.8rem)", fontWeight: 800, margin: "0 0 1rem", letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1 }}>
          Pregnancy risk detection<br />
          <span style={{ color: "#0284c7" }}>built for Somalia</span>
        </h1>

        <p style={{ fontSize: "1rem", color: "#64748b", maxWidth: 500, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          {t.tagline}. Speaks Somali. Trained on real hospital data. Free to use.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <button onClick={() => setPage("form")} style={S.btnPrimary}>{t.start} →</button>
          <button onClick={() => setPage("how")} style={S.btnSecondary}>{t.learn}</button>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { num: "81%", label: language === "en" ? "Model accuracy" : "Saxnaanta modelka" },
            { num: "1,014", label: language === "en" ? "Real patient records" : "Bukaanno dhabta ah" },
            { num: "3", label: language === "en" ? "Risk levels" : "Heerarka khatarta" },
          ].map((s, i) => (
            <div key={i} style={{ ...S.card, textAlign: "center", marginBottom: 0 }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0284c7" }}>{s.num}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* PILLS */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["🇸🇴 Speaks Somali", "🤖 Trained ML Model", "💊 WHO Guidelines", "📱 Mobile Friendly", "🆓 Free"].map((f, i) => (
            <span key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "#64748b" }}>{f}</span>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "2rem", fontSize: 12, color: "#94a3b8", borderTop: "1px solid #e2e8f0", marginTop: "2rem" }}>
        {t.disclaimer} · Somalia Emergency: <strong style={{ color: "#dc2626" }}>888</strong>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )

  // ─── FORM PAGE ───
  if (page === "form") return (
    <div style={S.page}>
      <nav style={S.nav}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>← Back</button>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>🤱 {t.form_title}</div>
        <LangToggle />
      </nav>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* EMERGENCY BANNER */}
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#dc2626", textAlign: "center", marginBottom: "1.5rem", fontWeight: 500 }}>
          🚨 Somalia Emergency Number: <strong>888</strong>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { key: "age", label: t.age, placeholder: "e.g. 25", hint: "Range: 10 – 70 years" },
            { key: "systolic_bp", label: t.sbp, placeholder: "e.g. 120", hint: "Range: 70 – 160 mmHg" },
            { key: "diastolic_bp", label: t.dbp, placeholder: "e.g. 80", hint: "Range: 49 – 100 mmHg" },
            { key: "blood_sugar", label: t.bs, placeholder: "e.g. 7.5", hint: "Range: 6 – 19 mmol/L" },
            { key: "body_temp", label: t.temp, placeholder: "e.g. 98.0", hint: "Range: 98 – 103 °F" },
            { key: "heart_rate", label: t.hr, placeholder: "e.g. 76", hint: "Range: 60 – 100 bpm" },
          ].map(field => (
            <div key={field.key} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px" }}>
              <label style={S.label}>{field.label}</label>
              <input
                type="number"
                placeholder={field.placeholder}
                value={vitals[field.key]}
                onChange={e => setVitals({ ...vitals, [field.key]: e.target.value })}
                style={S.input}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <span style={S.hint}>{field.hint}</span>
            </div>
          ))}
        </div>

        <button onClick={handleCheck} disabled={loading}
          style={{ ...S.btnPrimary, width: "100%", padding: "1rem", fontSize: 16, opacity: loading ? 0.7 : 1 }}>
          {loading ? `⏳ ${t.checking}` : `🔍 ${t.check}`}
        </button>

        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>{t.disclaimer}</p>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;} input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}`}</style>
    </div>
  )

  // ─── RESULT PAGE ───
  if (page === "result" && result) return (
    <div style={S.page}>
      <nav style={S.nav}>
        <button onClick={() => { setPage("form"); setResult(null); setAdvice("") }}
          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
          {t.back}
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>🤱 Risk Result</div>
        <LangToggle />
      </nav>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* RISK CARD */}
        <div style={{ background: riskConfig.bg, border: `2px solid ${riskConfig.border}`, borderRadius: 18, padding: "2rem", textAlign: "center", marginBottom: "1.2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 60, marginBottom: 10 }}>{riskConfig.emoji}</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: riskConfig.color, letterSpacing: "-0.02em", marginBottom: 4 }}>{riskConfig.label}</div>
          <div style={{ fontSize: "1rem", color: riskConfig.color, opacity: 0.7, marginBottom: "1.2rem" }}>{riskConfig.somali}</div>
          <div style={{ fontSize: 14, color: "#374151", background: riskConfig.textBg, borderRadius: 8, padding: "10px 16px", marginBottom: "1rem", lineHeight: 1.5, fontWeight: 500 }}>
            {riskConfig.action}
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {t.confidence}: <span style={{ color: riskConfig.color, fontWeight: 800, fontSize: 18 }}>{result.confidence}%</span>
          </div>
        </div>

        {/* PROBABILITIES */}
        <div style={{ ...S.card }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{t.probabilities}</p>
          {Object.entries(result.probabilities).map(([risk, prob]) => (
            <div key={risk} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ color: "#374151", textTransform: "capitalize", fontWeight: 500 }}>{risk}</span>
                <span style={{ color: RISK_CONFIG[risk]?.color || "#000", fontWeight: 700 }}>{prob}%</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${prob}%`, background: RISK_CONFIG[risk]?.color || "#000", borderRadius: 999, transition: "width 1.2s ease" }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* VITALS SUMMARY */}
        <div style={{ ...S.card }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Your Vitals</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Age", value: `${vitals.age} yrs` },
              { label: "Blood Pressure", value: `${vitals.systolic_bp}/${vitals.diastolic_bp}` },
              { label: "Blood Sugar", value: `${vitals.blood_sugar} mmol/L` },
              { label: "Temperature", value: `${vitals.body_temp}°F` },
              { label: "Heart Rate", value: `${vitals.heart_rate} bpm` },
              { label: "Emergency 🇸🇴", value: "888" },
            ].map((v, i) => (
              <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, fontWeight: 500 }}>{v.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{v.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GET ADVICE */}
        {!advice && (
          <button onClick={handleGetAdvice} disabled={adviceLoading}
            style={{ width: "100%", background: adviceLoading ? "#f1f5f9" : "linear-gradient(135deg, #0ea5e9, #0284c7)", color: adviceLoading ? "#94a3b8" : "#fff", border: "none", borderRadius: 10, padding: "1rem", fontWeight: 700, fontSize: 15, cursor: adviceLoading ? "default" : "pointer", marginBottom: "1.2rem", boxShadow: adviceLoading ? "none" : "0 4px 12px rgba(14,165,233,0.3)" }}>
            {adviceLoading ? `⏳ ${t.getting}` : `💬 ${t.get_advice}`}
          </button>
        )}

        {/* ADVICE */}
        {advice && (
          <div style={{ ...S.card, border: `1px solid ${riskConfig.border}`, background: riskConfig.bg }}>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{t.advice_title}</p>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{advice}</p>
          </div>
        )}

        {/* DISCLAIMER */}
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#dc2626", textAlign: "center", lineHeight: 1.6 }}>
          ⚠️ {t.disclaimer}<br />
          <strong style={{ fontSize: 13 }}>{t.emergency}</strong>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;}`}</style>
    </div>
  )

  // ─── HOW IT WORKS ───
  if (page === "how") return (
    <div style={S.page}>
      <nav style={S.nav}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>← Back</button>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>How Hooyo AI Works</div>
        <LangToggle />
      </nav>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {[
          { step: "01", icon: "📋", title: "Enter your vital signs", desc: "Input your age, blood pressure, blood sugar, body temperature, and heart rate. No account needed." },
          { step: "02", icon: "🧠", title: "ML model predicts risk", desc: "Our Random Forest model trained on 1,014 real maternal health records analyzes your vitals with 81.28% accuracy." },
          { step: "03", icon: "🔴🟡🟢", title: "See your risk level instantly", desc: "Get a clear LOW, MEDIUM, or HIGH risk result with confidence percentage and full probability breakdown." },
          { step: "04", icon: "💬", title: "Get personalized advice in Somali", desc: "Gemini AI reads your vitals and risk level to give specific actions, danger signs, and clinic guidance — in Somali or English." },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0284c7", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "3px 8px", flexShrink: 0, height: "fit-content", marginTop: 2 }}>{s.step}</div>
            <div>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px", color: "#0f172a" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </div>
        ))}

        <button onClick={() => setPage("form")} style={{ ...S.btnPrimary, width: "100%", padding: "1rem", fontSize: 15 }}>
          Check My Risk Now →
        </button>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;}`}</style>
    </div>
  )
}