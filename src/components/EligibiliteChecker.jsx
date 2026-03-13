import React, { useState, useCallback, useEffect } from "react";

// ─── QUESTIONS ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "secteur",
    title: "Quel est votre secteur d'activite ?",
    subtitle: "Cela nous permet d'identifier les dispositifs disponibles.",
    options: [
      { value: "restaurant", emoji: "🍽️", label: "Restaurant / Brasserie" },
      { value: "hotel", emoji: "🏨", label: "Hotel / Hebergement" },
      { value: "cafe", emoji: "☕", label: "Cafe / Bar" },
      { value: "autre_hcr", emoji: "🍴", label: "Autre secteur HCR" },
      { value: "hors_hcr", emoji: "🏢", label: "Hors secteur HCR" },
    ],
  },
  {
    id: "salaries",
    title: "Combien de salaries dans votre entreprise ?",
    subtitle: "Le nombre de salaries determine l'OPCO et les plafonds.",
    options: [
      { value: "0", emoji: "👤", label: "Aucun (je suis seul)" },
      { value: "1-10", emoji: "👥", label: "1 a 10" },
      { value: "11-49", emoji: "🏠", label: "11 a 49" },
      { value: "50+", emoji: "🏢", label: "50 et plus" },
    ],
  },
  {
    id: "statut",
    title: "Quel est votre statut ?",
    subtitle: "Chaque statut ouvre des droits differents.",
    options: [
      { value: "salarie", emoji: "💼", label: "Salarie", subtitle: "Gerant ou employe" },
      { value: "tns", emoji: "🔑", label: "TNS / Independant", subtitle: "Gerant non salarie" },
      { value: "auto", emoji: "📋", label: "Auto-entrepreneur", subtitle: "Micro-entreprise" },
      { value: "demandeur", emoji: "🎯", label: "Demandeur d'emploi" },
      { value: "reconversion", emoji: "🔄", label: "En reconversion / Creation" },
    ],
  },
  {
    id: "site",
    title: "Avez-vous deja un site web ?",
    subtitle: "On adapte la formation a votre situation actuelle.",
    options: [
      { value: "non", emoji: "🚀", label: "Non, pas encore" },
      { value: "besoin_aide", emoji: "🔧", label: "Oui, mais il a besoin d'aide" },
      { value: "ok", emoji: "✅", label: "Oui, il est fonctionnel" },
    ],
  },
  {
    id: "objectif",
    title: "Quel est votre objectif principal ?",
    subtitle: "Derniere question pour personnaliser le resultat.",
    options: [
      { value: "creer_site", emoji: "🌐", label: "Creer mon site et etre visible sur Google" },
      { value: "apprendre", emoji: "📚", label: "Apprendre a gerer ma presence en ligne" },
      { value: "clients", emoji: "📍", label: "Attirer plus de clients locaux" },
      { value: "tout", emoji: "⚡", label: "Tout digitaliser" },
    ],
  },
];

// ─── ELIGIBILITY LOGIC ───────────────────────────────────────────────────
function determineEligibility(answers) {
  const { secteur, salaries, statut } = answers;
  const isHCR = secteur !== "hors_hcr";
  const dispositifs = [];
  let coverage = 0;
  let message = "";

  if (!isHCR) {
    return {
      eligible: false,
      dispositifs: [],
      coverage: 0,
      message:
        "Votre secteur ne releve pas directement du HCR, mais d'autres dispositifs peuvent exister. Contactez-nous pour etudier votre situation personnalisee.",
    };
  }

  if (salaries === "50+") {
    return {
      eligible: true,
      dispositifs: [
        {
          name: "OPCO AKTO — Grandes entreprises",
          amount: "Modalites specifiques",
          detail:
            "Les entreprises de 50 salaries et plus ont des modalites de financement specifiques aupres d'AKTO. Contactez-nous pour une etude personnalisee.",
        },
      ],
      coverage: 0,
      message:
        "Votre entreprise releve de modalites specifiques. Un entretien nous permettra de determiner la meilleure approche.",
    };
  }

  // OPCO AKTO
  if (statut === "salarie") {
    dispositifs.push({
      name: "OPCO AKTO",
      amount: "Jusqu'a 100 %",
      detail:
        "En tant que salarie du secteur HCR (moins de 50 salaries), AKTO prend en charge 100 % du cout pedagogique. Remuneration du salarie : 15 €/h rembourses.",
    });
    coverage = 100;
  }

  // AGEFICE (TNS + auto-entrepreneur)
  if (statut === "tns" || statut === "auto") {
    dispositifs.push({
      name: "AGEFICE",
      amount: "Jusqu'a 3 500 €/an",
      detail:
        "En tant que travailleur non salarie du secteur HCR, l'AGEFICE finance votre formation a hauteur de 3 500 € par an.",
    });
    coverage = Math.max(coverage, 100);
  }

  // France Travail AIF
  if (statut === "demandeur" || statut === "reconversion") {
    dispositifs.push({
      name: "France Travail (AIF)",
      amount: "Jusqu'a 100 %",
      detail:
        "L'Aide Individuelle a la Formation (AIF) de France Travail peut couvrir 100 % du cout de la formation pour les demandeurs d'emploi et les personnes en reconversion.",
    });
    coverage = Math.max(coverage, 100);
  }

  // Aides regionales (always if HCR)
  if (isHCR) {
    dispositifs.push({
      name: "Aides regionales",
      amount: "500 € a 5 000 €",
      detail:
        "Cheques numeriques, programme Atouts Numeriques, aides CCI — souvent cumulables avec votre dispositif principal.",
    });
  }

  if (coverage >= 100) {
    message =
      "Bonne nouvelle ! Votre profil est eligible a une prise en charge pouvant couvrir 100 % du cout de la formation.";
  } else if (dispositifs.length > 0) {
    message =
      "Des dispositifs de financement sont disponibles pour votre profil. Contactez-nous pour monter votre dossier.";
  }

  return { eligible: dispositifs.length > 0, dispositifs, coverage, message };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────
export default function EligibiliteChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transitioning, setTransitioning] = useState(false);
  const [phone, setPhone] = useState("");
  const [callbackSent, setCallbackSent] = useState(false);

  const totalSteps = QUESTIONS.length;
  const isDone = step >= totalSteps;

  // Listen for open event from Astro
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener("open-eligibilite", handleOpen);
    return () => document.removeEventListener("open-eligibilite", handleOpen);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setStep(0);
    setAnswers({});
    setTransitioning(false);
    setPhone("");
    setCallbackSent(false);
  };

  const pickSingle = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setTransitioning(false);
      }, 350);
    }, 250);
  }, []);

  const restart = () => {
    setStep(0);
    setAnswers({});
    setTransitioning(false);
    setPhone("");
    setCallbackSent(false);
  };

  const result = isDone ? determineEligibility(answers) : null;

  const handleCallback = () => {
    if (!phone.trim()) return;
    const subject = encodeURIComponent("Demande de rappel — Quiz eligibilite");
    const body = encodeURIComponent(
      `Bonjour,\n\nUn visiteur souhaite etre rappele.\n\nTelephone : ${phone}\n\nResultats du quiz :\n- Secteur : ${answers.secteur}\n- Salaries : ${answers.salaries}\n- Statut : ${answers.statut}\n- Site web : ${answers.site}\n- Objectif : ${answers.objectif}\n\nDispositifs identifies : ${result.dispositifs.map((d) => d.name).join(", ")}\n\nCordialement`
    );
    window.open(`mailto:remipradere@gmail.com?subject=${subject}&body=${body}`, "_self");
    setCallbackSent(true);
  };

  if (!isOpen) return null;

  // ─── STYLES ──────────────────────────────────────────────────────────
  const s = {
    overlay: {
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(15,27,46,0.65)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      animation: "eligFadeIn 300ms ease",
    },
    modal: {
      position: "relative",
      background: "#fff",
      borderRadius: 20,
      width: "100%",
      maxWidth: 560,
      maxHeight: "90vh",
      overflowY: "auto",
      padding: "40px 28px 32px",
      boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
      animation: "eligSlideUp 400ms cubic-bezier(0.12,1,0.2,1)",
    },
    closeBtn: {
      position: "absolute",
      top: 14,
      right: 14,
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "none",
      background: "#f1f5f9",
      color: "#64748b",
      fontSize: 18,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
      zIndex: 1,
    },
    header: {
      textAlign: "center",
      marginBottom: 28,
    },
    stepLabel: {
      display: "inline-block",
      fontSize: 12,
      fontWeight: 600,
      color: "#2563eb",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 12,
    },
    title: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
      fontWeight: 500,
      color: "#0f1b2e",
      marginBottom: 6,
      letterSpacing: "-0.02em",
    },
    subtitle: {
      fontSize: 14,
      color: "#94a3b8",
      lineHeight: 1.6,
    },
    optionsList: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    choiceBtn: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      width: "100%",
      padding: "15px 18px",
      background: "#fff",
      border: "1.5px solid #e2e8f0",
      borderRadius: 12,
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
      textAlign: "left",
      fontFamily: "inherit",
      fontSize: 15,
      color: "#0f1b2e",
      fontWeight: 500,
    },
    choiceBtnHover: {
      borderColor: "#2563eb",
      background: "rgba(37,99,235,0.04)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 16px rgba(37,99,235,0.1)",
    },
    choiceEmoji: {
      fontSize: 20,
      flexShrink: 0,
      width: 32,
      textAlign: "center",
    },
    choiceLabel: {
      fontWeight: 600,
      fontSize: 15,
      color: "#0f1b2e",
    },
    choiceSub: {
      fontSize: 13,
      color: "#94a3b8",
      fontWeight: 400,
    },
    fadeIn: {
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 350ms cubic-bezier(0.12,1,0.2,1), transform 350ms cubic-bezier(0.12,1,0.2,1)",
    },
    fadeOut: {
      opacity: 0,
      transform: "translateY(16px)",
      transition: "opacity 350ms cubic-bezier(0.12,1,0.2,1), transform 350ms cubic-bezier(0.12,1,0.2,1)",
    },
    resultBanner: {
      textAlign: "center",
      padding: "24px 20px",
      borderRadius: 16,
      background: "linear-gradient(135deg, rgba(5,150,105,0.08), rgba(37,99,235,0.08))",
      border: "1px solid rgba(5,150,105,0.2)",
      marginBottom: 24,
    },
    resultBannerNotEligible: {
      background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(148,163,184,0.06))",
      border: "1px solid rgba(37,99,235,0.15)",
    },
    coverageText: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "clamp(2rem, 6vw, 3rem)",
      fontWeight: 700,
      color: "#059669",
      letterSpacing: "-0.03em",
    },
    coverageLabel: {
      fontSize: 14,
      color: "#4a5568",
      marginTop: 4,
    },
    dispositifCard: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 10,
    },
    dispositifName: {
      fontWeight: 700,
      fontSize: 15,
      color: "#0f1b2e",
      marginBottom: 3,
    },
    dispositifAmount: {
      fontWeight: 700,
      fontSize: 14,
      color: "#059669",
      marginBottom: 6,
    },
    dispositifDetail: {
      fontSize: 13,
      color: "#4a5568",
      lineHeight: 1.6,
    },
    message: {
      fontSize: 15,
      color: "#4a5568",
      lineHeight: 1.7,
      textAlign: "center",
      margin: "20px 0",
    },
    ctaGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 20,
    },
    ctaRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
    },
    ctaBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "13px 20px",
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 14,
      textDecoration: "none",
      cursor: "pointer",
      border: "none",
      fontFamily: "inherit",
      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
      flex: 1,
      minWidth: 140,
    },
    ctaPrimary: {
      background: "#0f1b2e",
      color: "#fff",
    },
    ctaOutline: {
      background: "transparent",
      color: "#0f1b2e",
      border: "1.5px solid #0f1b2e",
    },
    callbackBox: {
      display: "flex",
      gap: 8,
      marginTop: 8,
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      border: "1.5px solid #e2e8f0",
      borderRadius: 10,
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      transition: "border-color 0.2s",
    },
    restartLink: {
      display: "block",
      textAlign: "center",
      marginTop: 20,
      fontSize: 13,
      color: "#94a3b8",
      cursor: "pointer",
      background: "none",
      border: "none",
      fontFamily: "inherit",
      textDecoration: "underline",
    },
  };

  // ─── RENDER ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes eligFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes eligSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div style={s.modal}>
          <button
            style={s.closeBtn}
            onClick={close}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            aria-label="Fermer"
          >
            ✕
          </button>

          {!isDone ? (
            <div style={transitioning ? s.fadeOut : s.fadeIn}>
              <div style={s.header}>
                <span style={s.stepLabel}>
                  Question {step + 1} / {totalSteps}
                </span>
                <h2 style={s.title}>{QUESTIONS[step].title}</h2>
                <p style={s.subtitle}>{QUESTIONS[step].subtitle}</p>
              </div>
              <div style={s.optionsList}>
                {QUESTIONS[step].options.map((opt) => (
                  <ChoiceButton
                    key={opt.value}
                    option={opt}
                    styles={s}
                    onClick={() => pickSingle(QUESTIONS[step].id, opt.value)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={s.fadeIn}>
              <div
                style={{
                  ...s.resultBanner,
                  ...(!result.eligible ? s.resultBannerNotEligible : {}),
                }}
              >
                {result.coverage > 0 ? (
                  <>
                    <div style={s.coverageText}>{result.coverage} %</div>
                    <div style={s.coverageLabel}>de prise en charge estimee</div>
                  </>
                ) : (
                  <>
                    <div style={{ ...s.coverageText, color: "#2563eb", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
                      Etude personnalisee
                    </div>
                    <div style={s.coverageLabel}>Contactez-nous pour en savoir plus</div>
                  </>
                )}
              </div>

              {result.dispositifs.map((d, i) => (
                <div key={i} style={s.dispositifCard}>
                  <div style={s.dispositifName}>{d.name}</div>
                  <div style={s.dispositifAmount}>{d.amount}</div>
                  <div style={s.dispositifDetail}>{d.detail}</div>
                </div>
              ))}

              <p style={s.message}>{result.message}</p>

              <div style={s.ctaGroup}>
                <div style={s.ctaRow}>
                  <a href="tel:+33619727540" style={{ ...s.ctaBtn, ...s.ctaPrimary }}>
                    📞 Appeler maintenant
                  </a>
                  <a href="mailto:remipradere@gmail.com" style={{ ...s.ctaBtn, ...s.ctaOutline }}>
                    ✉️ Envoyer un email
                  </a>
                </div>
                {!callbackSent ? (
                  <div style={s.callbackBox}>
                    <input
                      type="tel"
                      placeholder="Votre numero de telephone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={s.input}
                      onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <button
                      onClick={handleCallback}
                      style={{ ...s.ctaBtn, ...s.ctaPrimary, flex: "none", minWidth: "auto", padding: "12px 18px" }}
                    >
                      Etre rappele
                    </button>
                  </div>
                ) : (
                  <p style={{ textAlign: "center", fontSize: 14, color: "#059669", fontWeight: 600 }}>
                    ✓ Demande envoyee — nous vous rappelons rapidement !
                  </p>
                )}
              </div>

              <button onClick={restart} style={s.restartLink}>
                Recommencer le test
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── CHOICE BUTTON ───────────────────────────────────────────────────────
function ChoiceButton({ option, styles, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.choiceBtn,
        ...(hovered ? styles.choiceBtnHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={styles.choiceEmoji}>{option.emoji}</span>
      <span>
        <span style={styles.choiceLabel}>{option.label}</span>
        {option.subtitle && (
          <>
            <br />
            <span style={styles.choiceSub}>{option.subtitle}</span>
          </>
        )}
      </span>
    </button>
  );
}
