import React, { useState, useRef } from "react";

// ─── COULEURS & DESIGN SYSTEM ────────────────────────────────────────────────
const COLORS = {
  blue: "#2563eb",
  blueLight: "rgba(37,99,235,0.07)",
  navy: "#0f1b2e",
  text: "#1a1a2e",
  textSec: "#4a5568",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  bg: "#ffffff",
  bgSoft: "#f8fafc",
  green: "#10b981",
  orange: "#f59e0b",
  red: "#ef4444",
  redLight: "rgba(239,68,68,0.08)",
  orangeLight: "rgba(245,158,11,0.08)",
  greenLight: "rgba(16,185,129,0.08)",
};

function scoreColor(score) {
  if (score <= 25) return COLORS.green;
  if (score <= 50) return COLORS.orange;
  if (score <= 75) return COLORS.red;
  return COLORS.red;
}

function scoreBg(score) {
  if (score <= 25) return COLORS.greenLight;
  if (score <= 50) return COLORS.orangeLight;
  return COLORS.redLight;
}

function scoreEmoji(score) {
  if (score <= 25) return "✓";
  if (score <= 50) return "~";
  return "!";
}

// ─── JAUGE CIRCULAIRE ────────────────────────────────────────────────────────
function GaugeCircle({ score }) {
  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <text x="90" y="82" textAnchor="middle" style={{ fontSize: 38, fontWeight: 700, fontFamily: "'Playfair Display', serif", fill: color }}>
          {score}%
        </text>
        <text x="90" y="108" textAnchor="middle" style={{ fontSize: 13, fontWeight: 500, fill: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          score IA
        </text>
      </svg>
    </div>
  );
}

// ─── BARRE DE SIGNAL ─────────────────────────────────────────────────────────
function SignalBar({ signal }) {
  const color = scoreColor(signal.score);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", borderRadius: 10,
      background: signal.score > 50 ? scoreBg(signal.score) : COLORS.bgSoft,
      border: `1px solid ${signal.score > 50 ? color + "22" : COLORS.border}`,
      transition: "all 0.3s ease",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{signal.name}</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Poids : {signal.weight}%</div>
      </div>
      <div style={{
        width: 120, height: 6, borderRadius: 3, background: COLORS.border, overflow: "hidden",
      }}>
        <div style={{
          width: `${signal.score}%`, height: "100%", borderRadius: 3,
          background: color, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
      <div style={{
        minWidth: 42, textAlign: "right", fontSize: 14, fontWeight: 700, color,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {signal.score}%
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ────────────────────────────────────────────────────
export default function AIDetector() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleAnalyze() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Erreur inconnue");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAnalyze();
  }

  const sortedSignals = result
    ? [...result.signals].sort((a, b) => b.score - a.score)
    : [];

  const topSignals = sortedSignals.filter(s => s.score > 40);

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: COLORS.text,
    }}>
      {/* HEADER */}
      <div style={{
        background: COLORS.navy, color: "#fff", padding: "48px 20px 40px",
        textAlign: "center",
      }}>
        <a href="/" style={{
          position: "absolute", top: 16, left: 20, color: COLORS.textMuted,
          textDecoration: "none", fontSize: 13, fontWeight: 500,
        }}>
          &larr; Accueil
        </a>

        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20,
          background: "rgba(37,99,235,0.15)", color: COLORS.blue,
          fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 16,
        }}>
          SEO VISION
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 600, marginBottom: 10, lineHeight: 1.2,
        }}>
          Detecteur de contenu IA
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
          Analyse une page web et detecte le pourcentage de contenu
          probablement genere par intelligence artificielle.
        </p>
      </div>

      {/* INPUT */}
      <div style={{
        maxWidth: 640, margin: "-24px auto 0", padding: "0 20px", position: "relative", zIndex: 2,
      }}>
        <div style={{
          display: "flex", gap: 10, background: COLORS.bg, borderRadius: 14,
          padding: 6, boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: `1.5px solid ${COLORS.border}`,
        }}>
          <input
            ref={inputRef}
            type="url"
            placeholder="https://example.com/page-a-analyser"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{
              flex: 1, padding: "14px 16px", border: "none", outline: "none",
              fontSize: 15, fontFamily: "inherit", background: "transparent",
              color: COLORS.text, borderRadius: 10,
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            style={{
              padding: "14px 28px", borderRadius: 10, border: "none",
              background: loading ? COLORS.textMuted : COLORS.blue,
              color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              opacity: !url.trim() ? 0.5 : 1,
            }}
          >
            {loading ? "Analyse..." : "Analyser"}
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{
            width: 40, height: 40, border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.blue, borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            Recuperation et analyse de la page...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={{
          maxWidth: 640, margin: "24px auto", padding: "16px 20px",
          background: COLORS.redLight, border: `1px solid ${COLORS.red}22`,
          borderRadius: 10, color: COLORS.red, fontSize: 14, textAlign: "center",
        }}>
          {error}
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div style={{ maxWidth: 720, margin: "32px auto", padding: "0 20px" }}>

          {/* Score principal */}
          <div style={{
            background: COLORS.bg, borderRadius: 16, padding: "32px 24px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            border: `1px solid ${COLORS.border}`, textAlign: "center", marginBottom: 24,
          }}>
            <GaugeCircle score={result.score} />

            <div style={{
              display: "inline-block", padding: "8px 20px", borderRadius: 20,
              background: scoreBg(result.score), color: scoreColor(result.score),
              fontSize: 14, fontWeight: 600, marginTop: 8,
            }}>
              {result.label}
            </div>

            {/* Meta infos */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 24,
              marginTop: 20, flexWrap: "wrap",
            }}>
              {[
                { label: "Mots", value: result.wordCount },
                { label: "Langue", value: result.lang === "fr" ? "Francais" : "Anglais" },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>{value}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Titre de la page */}
            {result.title && (
              <div style={{
                marginTop: 16, padding: "10px 16px", borderRadius: 8,
                background: COLORS.bgSoft, fontSize: 13, color: COLORS.textSec,
                wordBreak: "break-word",
              }}>
                {result.title}
              </div>
            )}
          </div>

          {/* Signaux problématiques */}
          {topSignals.length > 0 && (
            <div style={{
              background: COLORS.bg, borderRadius: 16, padding: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              border: `1px solid ${COLORS.border}`, marginBottom: 24,
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600,
                marginBottom: 16, color: COLORS.navy,
              }}>
                Signaux detectes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {topSignals.map(s => <SignalBar key={s.key} signal={s} />)}
              </div>
            </div>
          )}

          {/* Tous les signaux */}
          <div style={{
            background: COLORS.bg, borderRadius: 16, padding: "24px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            border: `1px solid ${COLORS.border}`, marginBottom: 24,
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600,
              marginBottom: 16, color: COLORS.navy,
            }}>
              Detail des 15 signaux
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sortedSignals.map(s => <SignalBar key={s.key} signal={s} />)}
            </div>
          </div>

          {/* Détails techniques */}
          <details style={{
            background: COLORS.bgSoft, borderRadius: 12, padding: "16px 20px",
            border: `1px solid ${COLORS.border}`, marginBottom: 40,
          }}>
            <summary style={{
              cursor: "pointer", fontSize: 14, fontWeight: 600, color: COLORS.textSec,
            }}>
              Donnees brutes (JSON)
            </summary>
            <pre style={{
              marginTop: 12, fontSize: 11, color: COLORS.textMuted,
              overflow: "auto", maxHeight: 400, lineHeight: 1.5,
              background: COLORS.bg, padding: 16, borderRadius: 8,
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>

          {/* Légende */}
          <div style={{
            display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap",
            marginBottom: 40, fontSize: 12, color: COLORS.textMuted,
          }}>
            <span><span style={{ color: COLORS.green, fontWeight: 700 }}>0-25%</span> Humain</span>
            <span><span style={{ color: COLORS.orange, fontWeight: 700 }}>25-50%</span> Mixte</span>
            <span><span style={{ color: COLORS.red, fontWeight: 700 }}>50-75%</span> Probablement IA</span>
            <span><span style={{ color: COLORS.red, fontWeight: 700 }}>75-100%</span> IA</span>
          </div>
        </div>
      )}

      {/* FOOTER - si pas de résultat */}
      {!result && !loading && (
        <div style={{
          maxWidth: 640, margin: "48px auto", padding: "0 20px", textAlign: "center",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16, marginBottom: 32,
          }}>
            {[
              { num: "15", label: "Signaux analyses" },
              { num: "200+", label: "Mots IA detectes" },
              { num: "FR/EN", label: "Langues supportees" },
              { num: "<2s", label: "Temps d'analyse" },
            ].map(({ num, label }) => (
              <div key={label} style={{
                padding: "20px 16px", borderRadius: 12,
                border: `1px solid ${COLORS.border}`, background: COLORS.bgSoft,
              }}>
                <div style={{
                  fontSize: 24, fontWeight: 700, color: COLORS.blue,
                  fontFamily: "'Playfair Display', serif",
                }}>{num}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600,
            color: COLORS.navy, marginBottom: 12,
          }}>
            Comment ca marche ?
          </h3>
          <div style={{
            fontSize: 14, color: COLORS.textSec, lineHeight: 1.7, textAlign: "left",
            maxWidth: 500, margin: "0 auto",
          }}>
            <p style={{ marginBottom: 10 }}>
              <strong>1.</strong> Collez l'URL d'une page web ci-dessus
            </p>
            <p style={{ marginBottom: 10 }}>
              <strong>2.</strong> L'outil recupere le contenu texte de la page
            </p>
            <p style={{ marginBottom: 10 }}>
              <strong>3.</strong> 15 signaux heuristiques analysent le texte : mots typiquement IA,
              uniformite des phrases, tirets cadratins, transitions formelles, richesse de vocabulaire...
            </p>
            <p>
              <strong>4.</strong> Un score de 0% (humain) a 100% (IA) est calcule avec le detail
              de chaque signal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
