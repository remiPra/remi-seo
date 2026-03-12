import React, { useState, useRef, useCallback, useEffect } from "react";

// ─── CATALOGUE ───────────────────────────────────────────────────────────
const CATALOGUE = {
  // GMB
  gmb_creation: { name: "Création fiche Google", price: 49, type: "unique", desc: "Création complète ou récupération" },
  gmb_optim: { name: "Optimisation fiche Google", price: 99, type: "unique", desc: "Catégories, description, attributs, horaires" },
  gmb_gestion: { name: "Gestion mensuelle fiche Google", price: 39, type: "mensuel", desc: "Mise à jour infos, horaires, photos" },
  gmb_posts3: { name: "Pack 2-3 posts Google/mois", price: 25, type: "mensuel", desc: "Publications régulières" },
  gmb_posts5: { name: "Pack 4-5 posts Google/mois", price: 39, type: "mensuel", desc: "Publications fréquentes" },
  gmb_avis: { name: "Réponse aux avis Google", price: 25, type: "mensuel", desc: "Réponses personnalisées" },
  gmb_rapport: { name: "Rapport mensuel performance", price: 15, type: "mensuel", desc: "Vues, clics, appels, itinéraires" },
  // Site
  site_5: { name: "Site vitrine (1-5 pages)", price: 800, type: "unique", desc: "Design, contenu, responsive, SEO" },
  site_10: { name: "Site vitrine (6-10 pages)", price: 1200, type: "unique", desc: "Site complet + pages supplémentaires" },
  site_refonte: { name: "Refonte de site existant", price: 800, type: "unique", desc: "Modernisation et optimisation" },
  site_maintenance: { name: "Maintenance mensuelle", price: 29, type: "mensuel", desc: "Mises à jour, sécurité, sauvegardes" },
  site_resa: { name: "Module réservation en ligne", price: 149, type: "unique", desc: "Intégration système de réservation" },
  site_commande: { name: "Module commande en ligne", price: 249, type: "unique", desc: "Click & collect ou livraison" },
  site_hebergement: { name: "Hébergement + nom de domaine", price: 15, type: "mensuel", desc: "Gestion technique complète" },
  // SEO
  seo_audit: { name: "Audit SEO complet", price: 149, type: "unique", desc: "Technique, mots-clés, contenu" },
  seo_onpage: { name: "Optimisation SEO on-page", price: 99, type: "unique", desc: "Balises, titres, méta, maillage" },
  seo_article1: { name: "1 article blog SEO/mois", price: 35, type: "mensuel", desc: "Publication mensuelle ciblée" },
  seo_article2: { name: "2 articles blog SEO/mois", price: 59, type: "mensuel", desc: "Publications bimensuelles" },
  seo_motscles: { name: "Recherche mots-clés locaux", price: 69, type: "unique", desc: "Étude des recherches dans la zone" },
  seo_suivi: { name: "Suivi positionnement mensuel", price: 15, type: "mensuel", desc: "Rapport de classement Google" },
  seo_annuaires: { name: "Inscription annuaires locaux", price: 59, type: "unique", desc: "PagesJaunes, Yelp, TripAdvisor…" },
  // Social
  social_insta_creation: { name: "Création compte Instagram", price: 49, type: "unique", desc: "Profil, bio, visuels de lancement" },
  social_fb_creation: { name: "Création page Facebook", price: 49, type: "unique", desc: "Page pro complète" },
  social_tiktok_creation: { name: "Création compte TikTok", price: 59, type: "unique", desc: "Profil + premières vidéos" },
  social_pack4: { name: "Pack 4 posts/mois", price: 49, type: "mensuel", desc: "1 publication par semaine" },
  social_pack8: { name: "Pack 8 posts/mois", price: 89, type: "mensuel", desc: "2 publications par semaine" },
  social_mix: { name: "Pack 4 posts + 4 stories/mois", price: 59, type: "mensuel", desc: "Mix posts et stories" },
  social_insta_full: { name: "Gestion complète Instagram", price: 99, type: "mensuel", desc: "Posts + stories + reels" },
  social_fb_full: { name: "Gestion complète Facebook", price: 79, type: "mensuel", desc: "Publications + réponses" },
  social_multi: { name: "Gestion multi-plateformes", price: 149, type: "mensuel", desc: "Instagram + Facebook + TikTok" },
  // Visuel
  visual_4: { name: "Pack 4 visuels IA", price: 49, type: "unique", desc: "Cohérence graphique" },
  visual_10: { name: "Pack 10 visuels IA", price: 99, type: "unique", desc: "Lot complet pour lancement" },
  visual_template: { name: "Template réutilisable", price: 39, type: "unique", desc: "Modèle aux couleurs du client" },
  visual_menu: { name: "Création menu / carte PDF", price: 69, type: "unique", desc: "Design pro de votre menu" },
  visual_flyer: { name: "Création flyer", price: 69, type: "unique", desc: "Design A5 ou A4" },
  // Avis
  avis_qr_pack: { name: "Pack QR Codes multi-plateformes", price: 39, type: "unique", desc: "Google + TripAdvisor + autre" },
  avis_strategie: { name: "Stratégie de collecte d'avis", price: 39, type: "unique", desc: "Process complet" },
  avis_gestion_google: { name: "Gestion avis Google", price: 25, type: "mensuel", desc: "Réponses personnalisées" },
  avis_gestion_multi: { name: "Gestion avis multi-plateformes", price: 39, type: "mensuel", desc: "Google + TripAdvisor + autre" },
  avis_veille: { name: "Veille e-réputation", price: 19, type: "mensuel", desc: "Suivi note, alertes, rapport" },
  // Plateformes
  plat_tripadvisor: { name: "Optimisation TripAdvisor", price: 49, type: "unique", desc: "Profil complet, photos, infos" },
  plat_thefork: { name: "Optimisation TheFork", price: 49, type: "unique", desc: "Profil + menu + photos" },
  plat_booking: { name: "Optimisation Booking", price: 59, type: "unique", desc: "Pour hôtels / hébergements" },
  plat_airbnb: { name: "Optimisation Airbnb", price: 79, type: "unique", desc: "Annonce complète" },
  // Audit
  audit_complet: { name: "Audit stratégie digitale complet", price: 249, type: "unique", desc: "Google + site + réseaux + avis" },
  // Pub
  ads_google_creation: { name: "Création campagne Google Ads", price: 99, type: "unique", desc: "Configuration + ciblage" },
  ads_google_gestion: { name: "Gestion mensuelle Google Ads", price: 49, type: "mensuel", desc: "Optimisation + rapport" },
  ads_meta_creation: { name: "Création campagne Meta Ads", price: 99, type: "unique", desc: "Configuration + visuels" },
  ads_meta_gestion: { name: "Gestion mensuelle Meta Ads", price: 49, type: "mensuel", desc: "Optimisation + rapport" },
};

// ─── TEMOIGNAGES CONTEXTUELS ─────────────────────────────────────────────
const TEMOIGNAGES = {
  restaurant: {
    quote: "J'ai doublé mes réservations en 2 mois grâce à Google et Instagram.",
    name: "Marie",
    business: "La Table d'Or, Aix-en-Provence",
  },
  hotel: {
    quote: "Mon taux d'occupation est passé de 60% à 85% en une saison.",
    name: "Thomas",
    business: "Hôtel Le Provence, Marseille",
  },
  commerce: {
    quote: "Mes clients me trouvent enfin sur Google. Le bouche-à-oreille digital, ça change tout.",
    name: "Sophie",
    business: "Boutique Éclat, Aix-en-Provence",
  },
  artisan: {
    quote: "Avant, je n'avais que le bouche-à-oreille. Maintenant, 60% de mes clients viennent de Google.",
    name: "Lucas",
    business: "Lucas Plomberie, Gardanne",
  },
  autre: {
    quote: "Un vrai gain de temps. Je me concentre sur mon métier, Rémi gère ma visibilité.",
    name: "Camille",
    business: "Studio Yoga, Aix-en-Provence",
  },
};

// ─── ESTIMATION ROI ──────────────────────────────────────────────────────
const ROI_ESTIMATES = {
  restaurant: { metric: "de visibilité Google", value: "+45%", delay: "en 3 mois" },
  hotel: { metric: "de réservations directes", value: "+35%", delay: "en 4 mois" },
  commerce: { metric: "de trafic en boutique", value: "+30%", delay: "en 3 mois" },
  artisan: { metric: "de demandes de devis", value: "+50%", delay: "en 2 mois" },
  autre: { metric: "de visibilité en ligne", value: "+40%", delay: "en 3 mois" },
};

// ─── RECOMMENDATION ENGINE ──────────────────────────────────────────────
// Tiers: "essentiel" = always on, "recommande" = on by default, "option" = off by default
function buildRecommandation(a) {
  const essentiel = [];
  const recommande = [];
  const option = [];

  const isResto = a.metier === "restaurant";
  const isHotel = a.metier === "hotel";
  const isCommerce = a.metier === "commerce";
  const fromZero = a.situation === "zero";
  const improve = a.situation === "ameliorer";
  const deleguer = a.situation === "deleguer";
  const ambitionLow = a.objectif === "presence";
  const ambitionMid = a.objectif === "croissance";
  const ambitionHigh = a.objectif === "domination";

  // ── Google (toujours essentiel) ──
  if (fromZero) {
    essentiel.push("gmb_creation", "gmb_optim");
  }
  essentiel.push("gmb_gestion");

  if (ambitionHigh || deleguer) {
    recommande.push("gmb_posts5");
    recommande.push("gmb_rapport");
  } else if (ambitionMid) {
    recommande.push("gmb_posts3");
    option.push("gmb_rapport");
  } else {
    option.push("gmb_posts3");
  }

  // ── Site web ──
  if (a.site === "non") {
    essentiel.push("site_5", "site_hebergement");
    if (isResto) recommande.push("site_resa");
    if (isCommerce) recommande.push("site_commande");
  } else if (a.site === "refonte") {
    essentiel.push("site_refonte");
    recommande.push("site_maintenance");
  } else if (a.site === "oui") {
    recommande.push("site_maintenance");
  }

  // ── SEO ──
  if (a.priorites.includes("google")) {
    if (fromZero || improve) {
      essentiel.push("seo_audit", "seo_onpage");
      recommande.push("seo_motscles");
    }
    recommande.push("seo_annuaires");
    if (ambitionHigh || deleguer) {
      recommande.push("seo_article2", "seo_suivi");
    } else if (ambitionMid) {
      recommande.push("seo_article1", "seo_suivi");
    } else {
      option.push("seo_article1", "seo_suivi");
    }
  }

  // ── Réseaux sociaux ──
  if (a.priorites.includes("reseaux")) {
    if (fromZero) essentiel.push("social_insta_creation", "social_fb_creation");
    if (deleguer || ambitionHigh) {
      recommande.push("social_insta_full");
    } else if (ambitionMid) {
      recommande.push("social_pack4");
    } else {
      option.push("social_pack4");
    }
    if (deleguer) option.push("visual_template");
  }

  // ── Avis ──
  if (a.priorites.includes("avis")) {
    essentiel.push("avis_qr_pack", "avis_strategie");
    if (deleguer || ambitionHigh) {
      recommande.push("avis_gestion_multi", "avis_veille");
    } else {
      recommande.push("avis_gestion_google");
      option.push("avis_veille");
    }
  }

  // ── Plateformes sectorielles ──
  if (isResto) {
    recommande.push("plat_tripadvisor", "plat_thefork");
  }
  if (isHotel) {
    recommande.push("plat_booking", "plat_tripadvisor");
  }

  // ── Pub ──
  if (a.priorites.includes("pub")) {
    recommande.push("ads_google_creation", "ads_google_gestion");
    if (ambitionHigh || deleguer) {
      option.push("ads_meta_creation", "ads_meta_gestion");
    }
  }

  // ── Audit complet ──
  if (deleguer && fromZero) {
    essentiel.push("audit_complet");
  }

  // ── Visuels lancement ──
  if (fromZero) {
    recommande.push("visual_10");
    if (isResto) recommande.push("visual_menu");
  }

  // Deduplicate each tier & ensure items exist
  const dedup = (arr) => [...new Set(arr)].filter(id => CATALOGUE[id]);
  return {
    essentiel: dedup(essentiel),
    recommande: dedup(recommande),
    option: dedup(option),
  };
}

// ─── PERSISTENCE ─────────────────────────────────────────────────────────
const STORAGE_KEY = "remi_estimateur_session";

function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch (e) { /* silently fail */ }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) { return null; }
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* */ }
}

// ─── UI COMPONENTS ───────────────────────────────────────────────────────
const STEPS = ["metier", "situation", "site", "priorites", "objectif", "contact", "resultat"];

function ChoiceButton({ label, sub, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        border: `1.5px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
        background: selected ? "rgba(37,99,235,0.06)" : "#fff",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {icon && <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>}
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: selected ? "#2563eb" : "#0f1b2e", letterSpacing: "-0.01em" }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
      </div>
    </button>
  );
}

function MultiChoiceButton({ label, sub, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 20px",
        borderRadius: 12,
        border: `1.5px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
        background: selected ? "rgba(37,99,235,0.06)" : "#fff",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: `1.5px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
        background: selected ? "#2563eb" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease",
      }}>
        {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      {icon && <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>}
      <div>
        <div style={{ fontSize: 15, fontWeight: 500, color: selected ? "#2563eb" : "#0f1b2e" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

function TierSection({ title, subtitle, color, items, toggleState, onToggle, locked }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</span>
        {subtitle && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>{subtitle}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(id => {
          const item = CATALOGUE[id];
          if (!item) return null;
          const isActive = toggleState[id] !== false;
          const isLocked = locked;
          return (
            <button
              key={id}
              onClick={() => !isLocked && onToggle(id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", borderRadius: 10,
                border: `1px solid ${isActive ? (isLocked ? "rgba(37,99,235,0.2)" : "#e2e8f0") : "#f1f5f9"}`,
                background: isActive ? (isLocked ? "rgba(37,99,235,0.04)" : "#fff") : "#fafafa",
                cursor: isLocked ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: isActive ? 1 : 0.4,
                transition: "all 0.3s ease",
                textAlign: "left", width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `1.5px solid ${isActive ? (isLocked ? "#2563eb" : "#2563eb") : "#e2e8f0"}`,
                  background: isActive ? "#2563eb" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isActive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#0f1b2e", textDecoration: isActive ? "none" : "line-through" }}>
                    {item.name}
                    {isLocked && <span style={{ marginLeft: 6, fontSize: 10, color: "#2563eb", fontWeight: 600, background: "rgba(37,99,235,0.08)", padding: "1px 6px", borderRadius: 4 }}>essentiel</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? "#2563eb" : "#94a3b8" }}>{item.price}€</div>
                <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 500 }}>{item.type}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function Estimateur() {
  const [currentStep, setCurrentStep] = useState("metier");
  const [answers, setAnswers] = useState({
    metier: "",
    situation: "",
    site: "",
    priorites: [],
    objectif: "",
  });
  const [tiers, setTiers] = useState({ essentiel: [], recommande: [], option: [] });
  const [toggleState, setToggleState] = useState({});
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [savedSession, setSavedSession] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);

  // ── Load saved session on mount ──
  useEffect(() => {
    const session = loadSession();
    if (session && session.currentStep && session.answers?.metier) {
      setSavedSession(session);
      setShowResume(true);
    }
  }, []);

  // ── Save session on change ──
  useEffect(() => {
    if (answers.metier) {
      saveSession({ currentStep, answers, contactName, contactPhone });
    }
  }, [currentStep, answers, contactName, contactPhone]);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  const goToStep = useCallback((step) => {
    setTransitioning(true);
    setTimeout(() => {
      if (step === "resultat") {
        const reco = buildRecommandation(answers);
        setTiers(reco);
        // Init toggle state: essentiel always on, recommande on, option off
        const state = {};
        reco.essentiel.forEach(id => { state[id] = true; });
        reco.recommande.forEach(id => { state[id] = true; });
        reco.option.forEach(id => { state[id] = false; });
        setToggleState(state);
      }
      setCurrentStep(step);
      setTransitioning(false);
    }, 350);
  }, [answers]);

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      goToStep(STEPS[idx + 1]);
    }
  }, [currentStep, goToStep]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      goToStep(STEPS[idx - 1]);
    }
  }, [currentStep, goToStep]);

  const pickSingle = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(goNext, 250);
  };

  const toggleMulti = (value) => {
    setAnswers(prev => ({
      ...prev,
      priorites: prev.priorites.includes(value)
        ? prev.priorites.filter(v => v !== value)
        : [...prev.priorites, value],
    }));
  };

  const toggleItem = (id) => {
    // Can't toggle essentiel items
    if (tiers.essentiel.includes(id)) return;
    setToggleState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resumeSession = () => {
    if (savedSession) {
      setAnswers(savedSession.answers);
      setContactName(savedSession.contactName || "");
      setContactPhone(savedSession.contactPhone || "");
      setCurrentStep(savedSession.currentStep);
      if (savedSession.currentStep === "resultat") {
        const reco = buildRecommandation(savedSession.answers);
        setTiers(reco);
        const state = {};
        reco.essentiel.forEach(id => { state[id] = true; });
        reco.recommande.forEach(id => { state[id] = true; });
        reco.option.forEach(id => { state[id] = false; });
        setToggleState(state);
      }
    }
    setShowResume(false);
  };

  const dismissResume = () => {
    clearSession();
    setShowResume(false);
  };

  // ── Compute totals ──
  const allActive = [...tiers.essentiel, ...tiers.recommande, ...tiers.option].filter(id => toggleState[id] !== false);
  const totalUnique = allActive.filter(id => CATALOGUE[id]?.type === "unique").reduce((s, id) => s + (CATALOGUE[id]?.price || 0), 0);
  const totalMensuel = allActive.filter(id => CATALOGUE[id]?.type === "mensuel").reduce((s, id) => s + (CATALOGUE[id]?.price || 0), 0);
  const mensuelCount = allActive.filter(id => CATALOGUE[id]?.type === "mensuel").length;
  const remise = mensuelCount >= 2 ? Math.round(totalMensuel * 0.05) : 0;
  const finalMensuel = totalMensuel - remise;

  const canProceed = () => {
    switch (currentStep) {
      case "metier": return !!answers.metier;
      case "situation": return !!answers.situation;
      case "site": return !!answers.site;
      case "priorites": return answers.priorites.length > 0;
      case "objectif": return !!answers.objectif;
      case "contact": return contactPhone.length >= 8;
      default: return true;
    }
  };

  const roi = ROI_ESTIMATES[answers.metier] || ROI_ESTIMATES.autre;
  const temoignage = TEMOIGNAGES[answers.metier] || TEMOIGNAGES.autre;

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", color: "#0f1b2e", background: "#fff" }}>

      {/* Resume banner */}
      {showResume && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(37,99,235,0.97)", color: "#fff",
          padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, flexWrap: "wrap", backdropFilter: "blur(12px)",
        }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Vous aviez commencé une estimation.</span>
          <button onClick={resumeSession} style={{
            padding: "8px 20px", borderRadius: 8, border: "2px solid #fff",
            background: "#fff", color: "#2563eb", fontFamily: "inherit",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            Reprendre
          </button>
          <button onClick={dismissResume} style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)",
            background: "transparent", color: "#fff", fontFamily: "inherit",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
            Recommencer
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 3, background: "#f1f5f9" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)", width: `${progress}%`, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 3, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {stepIndex > 0 && currentStep !== "resultat" && (
              <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, color: "#94a3b8", fontFamily: "inherit", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Retour
              </button>
            )}
          </div>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#0f1b2e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>R</div>
          </a>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, minWidth: 60, textAlign: "right" }}>
            {stepIndex + 1}/{STEPS.length}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "100px 24px 120px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: currentStep === "resultat" ? "flex-start" : "center",
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(16px)" : "translateY(0)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}>

        {/* ── STEP 1: Métier ── */}
        {currentStep === "metier" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre activité</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Quel est votre <em style={{ color: "#2563eb", fontStyle: "italic" }}>métier</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Pour vous recommander les prestations les plus adaptées.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChoiceButton icon="🍽" label="Restaurant / Bar / Café" sub="Restauration, food truck, brasserie" selected={answers.metier === "restaurant"} onClick={() => pickSingle("metier", "restaurant")} />
              <ChoiceButton icon="🏨" label="Hôtel / Hébergement" sub="Hôtel, chambre d'hôtes, gîte, Airbnb" selected={answers.metier === "hotel"} onClick={() => pickSingle("metier", "hotel")} />
              <ChoiceButton icon="🛍" label="Commerce / Boutique" sub="Magasin, salon de coiffure, e-commerce" selected={answers.metier === "commerce"} onClick={() => pickSingle("metier", "commerce")} />
              <ChoiceButton icon="🔧" label="Artisan / Indépendant" sub="Plombier, électricien, photographe, coach" selected={answers.metier === "artisan"} onClick={() => pickSingle("metier", "artisan")} />
              <ChoiceButton icon="💼" label="Autre" sub="Profession libérale, association, startup" selected={answers.metier === "autre"} onClick={() => pickSingle("metier", "autre")} />
            </div>
          </div>
        )}

        {/* ── STEP 2: Situation ── */}
        {currentStep === "situation" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre situation</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Où en êtes-vous <em style={{ color: "#2563eb", fontStyle: "italic" }}>aujourd'hui</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Cela détermine le niveau d'accompagnement nécessaire.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChoiceButton icon="🚀" label="Je démarre de zéro" sub="Pas encore de présence en ligne, ou presque" selected={answers.situation === "zero"} onClick={() => pickSingle("situation", "zero")} />
              <ChoiceButton icon="📈" label="J'ai déjà une présence" sub="Mais je veux l'améliorer et la développer" selected={answers.situation === "ameliorer"} onClick={() => pickSingle("situation", "ameliorer")} />
              <ChoiceButton icon="🤝" label="Je veux tout déléguer" sub="J'ai pas le temps, je veux que quelqu'un gère tout" selected={answers.situation === "deleguer"} onClick={() => pickSingle("situation", "deleguer")} />
            </div>
          </div>
        )}

        {/* ── STEP 3: Site ── */}
        {currentStep === "site" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre site web</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Avez-vous un <em style={{ color: "#2563eb", fontStyle: "italic" }}>site web</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Le site est souvent le premier point de contact avec vos clients.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChoiceButton icon="✅" label="Oui, il est bien" sub="Il me convient, je veux juste le maintenir" selected={answers.site === "oui"} onClick={() => pickSingle("site", "oui")} />
              <ChoiceButton icon="🔄" label="Oui, mais il a besoin d'une refonte" sub="Il est daté, pas mobile-friendly, ou mal référencé" selected={answers.site === "refonte"} onClick={() => pickSingle("site", "refonte")} />
              <ChoiceButton icon="🆕" label="Non, je n'en ai pas" sub="J'en ai besoin d'un tout neuf" selected={answers.site === "non"} onClick={() => pickSingle("site", "non")} />
            </div>
          </div>
        )}

        {/* ── STEP 4: Priorités ── */}
        {currentStep === "priorites" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Vos priorités</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Qu'est-ce qui compte le plus <em style={{ color: "#2563eb", fontStyle: "italic" }}>pour vous</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Plusieurs choix possibles. On adapte les recommandations.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <MultiChoiceButton icon="🔍" label="Être trouvé sur Google" sub="Fiche Google, SEO, annuaires" selected={answers.priorites.includes("google")} onClick={() => toggleMulti("google")} />
              <MultiChoiceButton icon="📱" label="Être actif sur les réseaux" sub="Instagram, Facebook, TikTok" selected={answers.priorites.includes("reseaux")} onClick={() => toggleMulti("reseaux")} />
              <MultiChoiceButton icon="⭐" label="Gérer mes avis clients" sub="Collecter, répondre, surveiller" selected={answers.priorites.includes("avis")} onClick={() => toggleMulti("avis")} />
              <MultiChoiceButton icon="📣" label="Faire de la publicité" sub="Google Ads, Meta Ads" selected={answers.priorites.includes("pub")} onClick={() => toggleMulti("pub")} />
            </div>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                marginTop: 32, width: "100%", padding: "16px",
                borderRadius: 12, border: "none", fontFamily: "inherit",
                fontSize: 15, fontWeight: 600, cursor: canProceed() ? "pointer" : "default",
                background: canProceed() ? "#0f1b2e" : "#e2e8f0",
                color: canProceed() ? "#fff" : "#94a3b8",
                transition: "all 0.3s ease",
              }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* ── STEP 5: Objectif (remplace "budget") ── */}
        {currentStep === "objectif" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre ambition</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Quel est votre <em style={{ color: "#2563eb", fontStyle: "italic" }}>objectif</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              On adapte l'intensité des actions en fonction de votre ambition.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChoiceButton icon="🌱" label="Avoir une présence de base" sub="Exister en ligne, être trouvable par mes clients" selected={answers.objectif === "presence"} onClick={() => pickSingle("objectif", "presence")} />
              <ChoiceButton icon="🚀" label="Attirer de nouveaux clients chaque mois" sub="Être visible, actif, et générer du trafic régulièrement" selected={answers.objectif === "croissance"} onClick={() => pickSingle("objectif", "croissance")} />
              <ChoiceButton icon="👑" label="Dominer mon secteur localement" sub="Être LA référence de ma zone, devant tous mes concurrents" selected={answers.objectif === "domination"} onClick={() => pickSingle("objectif", "domination")} />
            </div>
          </div>
        )}

        {/* ── STEP 6: Contact (AVANT le résultat) ── */}
        {currentStep === "contact" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Dernière étape</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Où vous <em style={{ color: "#2563eb", fontStyle: "italic" }}>envoyer</em> votre estimation ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Je vous rappelle sous 24h pour en discuter. Sans engagement.
            </p>

            {/* Micro-témoignage contextuel */}
            <div style={{
              padding: "18px 20px", borderRadius: 14,
              background: "rgba(37,99,235,0.03)", border: "1px solid rgba(37,99,235,0.08)",
              marginBottom: 28,
            }}>
              <div style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>
                "{temoignage.quote}"
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                — {temoignage.name}, {temoignage.business}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Votre prénom"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                style={{
                  width: "100%", padding: "14px 16px",
                  borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#0f1b2e",
                  fontFamily: "inherit", fontSize: 15,
                  transition: "border-color 0.2s ease",
                }}
              />
              <input
                type="tel"
                placeholder="Votre numéro de téléphone"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                style={{
                  width: "100%", padding: "14px 16px",
                  borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#0f1b2e",
                  fontFamily: "inherit", fontSize: 15,
                  transition: "border-color 0.2s ease",
                }}
              />
              <button
                onClick={() => canProceed() && goNext()}
                disabled={!canProceed()}
                style={{
                  marginTop: 8, width: "100%", padding: "16px",
                  borderRadius: 12, border: "none", fontFamily: "inherit",
                  fontSize: 15, fontWeight: 600,
                  cursor: canProceed() ? "pointer" : "default",
                  background: canProceed() ? "#0f1b2e" : "#e2e8f0",
                  color: canProceed() ? "#fff" : "#94a3b8",
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Voir mon estimation personnalisée
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
              Vos données ne sont jamais partagées. Zéro spam, promis.
            </p>
          </div>
        )}

        {/* ── STEP 7: Résultat ── */}
        {currentStep === "resultat" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre estimation</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 500, marginBottom: 8, letterSpacing: "-0.02em" }}>
              {contactName ? `${contactName}, voici` : "Voici"} ce qu'on vous <em style={{ color: "#2563eb", fontStyle: "italic" }}>recommande</em>
            </h2>
            <p style={{ color: "#4a5568", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Cliquez sur une prestation pour l'ajouter ou la retirer. Les essentiels restent activés.
            </p>

            {/* ROI estimation */}
            <div style={{
              padding: "16px 20px", borderRadius: 14,
              background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.06))",
              border: "1px solid rgba(37,99,235,0.12)",
              marginBottom: 24, display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>📊</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0f1b2e", marginBottom: 2 }}>
                  Résultat estimé : <span style={{ color: "#2563eb" }}>{roi.value}</span> {roi.metric}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  Pour un établissement similaire au vôtre, {roi.delay}
                </div>
              </div>
            </div>

            {/* Totaux */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {totalUnique > 0 && (
                <div style={{ flex: 1, padding: "16px 18px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Mise en place</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#0f1b2e" }}>{totalUnique}€</div>
                </div>
              )}
              {finalMensuel > 0 && (
                <div style={{ flex: 1, padding: "16px 18px", borderRadius: 14, background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                  <div style={{ fontSize: 11, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Par mois</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#2563eb" }}>
                    {finalMensuel}€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span>
                  </div>
                  {remise > 0 && <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginTop: 2 }}>-5% combo ({remise}€ d'économie)</div>}
                </div>
              )}
            </div>

            {/* Tiers de prestations */}
            <TierSection
              title="Indispensable"
              subtitle="inclus dans votre stratégie"
              color="#2563eb"
              items={tiers.essentiel}
              toggleState={toggleState}
              onToggle={toggleItem}
              locked={true}
            />
            <TierSection
              title="Recommandé"
              subtitle="pour de meilleurs résultats"
              color="#7c3aed"
              items={tiers.recommande}
              toggleState={toggleState}
              onToggle={toggleItem}
              locked={false}
            />
            <TierSection
              title="En option"
              subtitle="pour aller encore plus loin"
              color="#94a3b8"
              items={tiers.option}
              toggleState={toggleState}
              onToggle={toggleItem}
              locked={false}
            />

            {/* Micro-témoignage */}
            <div style={{
              padding: "16px 20px", borderRadius: 14,
              background: "#f8fafc", border: "1px solid #f1f5f9",
              marginTop: 24, marginBottom: 24,
            }}>
              <div style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.6, fontStyle: "italic", marginBottom: 6 }}>
                "{temoignage.quote}"
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                — {temoignage.name}, {temoignage.business}
              </div>
            </div>

            {/* CTA principal */}
            {!submitted ? (
              <button
                onClick={() => {
                  setSubmitted(true);
                  clearSession();
                }}
                style={{
                  width: "100%", padding: "16px",
                  borderRadius: 12, border: "none", fontFamily: "inherit",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  background: "#0f1b2e", color: "#fff",
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                Recevoir mon devis personnalisé
              </button>
            ) : (
              <div style={{
                width: "100%", padding: "20px",
                borderRadius: 12, background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#10b981", marginBottom: 4 }}>
                  C'est envoyé !
                </div>
                <div style={{ fontSize: 13, color: "#4a5568" }}>
                  {contactName ? `${contactName}, je` : "Je"} vous rappelle sous 24h au {contactPhone}.
                </div>
              </div>
            )}

            {/* CTA alternatif — Audit gratuit */}
            {!submitted && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Pas encore prêt ?</div>
                <button
                  onClick={() => {
                    setSubmitted(true);
                    clearSession();
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                    color: "#2563eb", textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Commencez par un audit gratuit de 15 min
                </button>
              </div>
            )}

            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
              Estimation indicative, sans engagement. Devis personnalisé après échange.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
