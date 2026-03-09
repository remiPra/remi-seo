import React, { useState, useRef, useCallback } from "react";

// ─── CATALOGUE (from PDF) ─────────────────────────────────────────────────
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

// ─── MAPPING LOGIC ────────────────────────────────────────────────────────

function buildRecommandation(a) {
  const ids = [];
  const isResto = a.metier === "restaurant";
  const isHotel = a.metier === "hotel";
  const isCommerce = a.metier === "commerce";
  const fromZero = a.situation === "zero";
  const improve = a.situation === "ameliorer";
  const deleguer = a.situation === "deleguer";
  const budgetLow = a.budget === "50";
  const budgetMid = a.budget === "100";
  const budgetHigh = a.budget === "150";

  // Google — toujours pertinent
  if (fromZero) {
    ids.push("gmb_creation", "gmb_optim");
  }
  ids.push("gmb_gestion");
  if (!budgetLow) ids.push("gmb_rapport");

  // Posts Google
  if (budgetHigh || deleguer) ids.push("gmb_posts5");
  else if (budgetMid) ids.push("gmb_posts3");

  // Site web
  if (a.site === "non") {
    ids.push("site_5", "site_hebergement");
    if (isResto) ids.push("site_resa");
    if (isCommerce) ids.push("site_commande");
  } else if (a.site === "refonte") {
    ids.push("site_refonte", "site_maintenance");
  } else if (a.site === "oui") {
    ids.push("site_maintenance");
  }

  // SEO
  if (a.priorites.includes("google")) {
    if (fromZero || improve) ids.push("seo_audit", "seo_onpage", "seo_motscles");
    ids.push("seo_annuaires");
    if (budgetHigh || deleguer) ids.push("seo_article2", "seo_suivi");
    else if (budgetMid) ids.push("seo_article1", "seo_suivi");
    else ids.push("seo_suivi");
  }

  // Reseaux sociaux
  if (a.priorites.includes("reseaux")) {
    if (fromZero) ids.push("social_insta_creation", "social_fb_creation");
    if (deleguer || budgetHigh) {
      ids.push("social_insta_full");
    } else if (budgetMid) {
      ids.push("social_pack4");
    } else {
      ids.push("social_pack4");
    }
    if (deleguer) ids.push("visual_template");
  }

  // Avis
  if (a.priorites.includes("avis")) {
    ids.push("avis_qr_pack", "avis_strategie");
    if (deleguer || budgetHigh) ids.push("avis_gestion_multi", "avis_veille");
    else ids.push("avis_gestion_google");
  }

  // Plateformes sectorielles
  if (isResto) {
    ids.push("plat_tripadvisor", "plat_thefork");
  }
  if (isHotel) {
    ids.push("plat_booking", "plat_tripadvisor");
  }

  // Pub
  if (a.priorites.includes("pub")) {
    ids.push("ads_google_creation", "ads_google_gestion");
    if (budgetHigh || deleguer) ids.push("ads_meta_creation", "ads_meta_gestion");
  }

  // Audit complet si deleguer ou lancement
  if (deleguer && fromZero) {
    ids.push("audit_complet");
  }

  // Visuels lancement
  if (fromZero) {
    ids.push("visual_10");
    if (isResto) ids.push("visual_menu");
  }

  // Deduplicate
  return [...new Set(ids)].filter(id => CATALOGUE[id]);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────
const STEPS = ["metier", "situation", "site", "priorites", "budget", "resultat", "contact"];

function ChoiceButton({ label, sub, selected, onClick }) {
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
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: selected ? "#2563eb" : "#0f1b2e", letterSpacing: "-0.01em" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
    </button>
  );
}

function MultiChoiceButton({ label, sub, selected, onClick }) {
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
      <div>
        <div style={{ fontSize: 15, fontWeight: 500, color: selected ? "#2563eb" : "#0f1b2e" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function Estimateur() {
  const [currentStep, setCurrentStep] = useState("metier");
  const [answers, setAnswers] = useState({
    metier: "",
    situation: "",
    site: "",
    priorites: [],
    budget: "",
  });
  const [recommended, setRecommended] = useState([]);
  const [removed, setRemoved] = useState({});
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef(null);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = Math.round(((stepIndex) / (STEPS.length - 1)) * 100);

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        const nextStep = STEPS[idx + 1];
        if (nextStep === "resultat") {
          const reco = buildRecommandation(answers);
          setRecommended(reco);
          setRemoved({});
        }
        setCurrentStep(nextStep);
        setTransitioning(false);
      }, 400);
    }
  }, [currentStep, answers]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentStep(STEPS[idx - 1]);
        setTransitioning(false);
      }, 400);
    }
  }, [currentStep]);

  const pickSingle = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(goNext, 300);
  };

  const toggleMulti = (value) => {
    setAnswers(prev => ({
      ...prev,
      priorites: prev.priorites.includes(value)
        ? prev.priorites.filter(v => v !== value)
        : [...prev.priorites, value],
    }));
  };

  const toggleRemove = (id) => {
    setRemoved(prev => {
      const n = { ...prev };
      if (n[id]) delete n[id];
      else n[id] = true;
      return n;
    });
  };

  // Compute totals
  const activeItems = recommended.filter(id => !removed[id]);
  const totalUnique = activeItems.filter(id => CATALOGUE[id]?.type === "unique").reduce((s, id) => s + (CATALOGUE[id]?.price || 0), 0);
  const totalMensuel = activeItems.filter(id => CATALOGUE[id]?.type === "mensuel").reduce((s, id) => s + (CATALOGUE[id]?.price || 0), 0);

  // Remises
  const mensuelCount = activeItems.filter(id => CATALOGUE[id]?.type === "mensuel").length;
  const remise = mensuelCount >= 2 ? Math.round(totalMensuel * 0.05) : 0;
  const finalMensuel = totalMensuel - remise;

  const canProceed = () => {
    switch (currentStep) {
      case "metier": return !!answers.metier;
      case "situation": return !!answers.situation;
      case "site": return !!answers.site;
      case "priorites": return answers.priorites.length > 0;
      case "budget": return !!answers.budget;
      default: return true;
    }
  };

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif", color: "#0f1b2e", background: "#fff" }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 3, background: "#f1f5f9" }}>
        <div style={{ height: "100%", background: "#2563eb", width: `${progress}%`, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 3, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {stepIndex > 0 && (
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
        maxWidth: 540,
        margin: "0 auto",
        padding: "100px 24px 120px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(20px)" : "translateY(0)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}>

        {/* STEP 1: Metier */}
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
              <ChoiceButton label="Restaurant / Bar / Café" sub="Restauration, food truck, brasserie, bar" selected={answers.metier === "restaurant"} onClick={() => pickSingle("metier", "restaurant")} />
              <ChoiceButton label="Hôtel / Hébergement" sub="Hôtel, chambre d'hôtes, gîte, Airbnb" selected={answers.metier === "hotel"} onClick={() => pickSingle("metier", "hotel")} />
              <ChoiceButton label="Commerce / Boutique" sub="Magasin, e-commerce, salon de coiffure" selected={answers.metier === "commerce"} onClick={() => pickSingle("metier", "commerce")} />
              <ChoiceButton label="Artisan / Indépendant" sub="Plombier, électricien, photographe, coach" selected={answers.metier === "artisan"} onClick={() => pickSingle("metier", "artisan")} />
              <ChoiceButton label="Autre" sub="Profession libérale, association, startup" selected={answers.metier === "autre"} onClick={() => pickSingle("metier", "autre")} />
            </div>
          </div>
        )}

        {/* STEP 2: Situation */}
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
              <ChoiceButton label="Je démarre de zéro" sub="Pas encore de présence en ligne, ou presque" selected={answers.situation === "zero"} onClick={() => pickSingle("situation", "zero")} />
              <ChoiceButton label="J'ai déjà une présence" sub="Mais je veux l'améliorer et la développer" selected={answers.situation === "ameliorer"} onClick={() => pickSingle("situation", "ameliorer")} />
              <ChoiceButton label="Je veux tout déléguer" sub="J'ai pas le temps, je veux que quelqu'un gère tout" selected={answers.situation === "deleguer"} onClick={() => pickSingle("situation", "deleguer")} />
            </div>
          </div>
        )}

        {/* STEP 3: Site */}
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
              <ChoiceButton label="Oui, il est bien" sub="Il me convient, je veux juste le maintenir" selected={answers.site === "oui"} onClick={() => pickSingle("site", "oui")} />
              <ChoiceButton label="Oui, mais il a besoin d'une refonte" sub="Il est daté, pas mobile-friendly, ou mal référencé" selected={answers.site === "refonte"} onClick={() => pickSingle("site", "refonte")} />
              <ChoiceButton label="Non, je n'en ai pas" sub="J'en ai besoin d'un tout neuf" selected={answers.site === "non"} onClick={() => pickSingle("site", "non")} />
            </div>
          </div>
        )}

        {/* STEP 4: Priorites */}
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
              <MultiChoiceButton label="Être trouvé sur Google" sub="Fiche Google, SEO, annuaires" selected={answers.priorites.includes("google")} onClick={() => toggleMulti("google")} />
              <MultiChoiceButton label="Être actif sur les réseaux" sub="Instagram, Facebook, TikTok" selected={answers.priorites.includes("reseaux")} onClick={() => toggleMulti("reseaux")} />
              <MultiChoiceButton label="Gérer mes avis clients" sub="Collecter, répondre, surveiller" selected={answers.priorites.includes("avis")} onClick={() => toggleMulti("avis")} />
              <MultiChoiceButton label="Faire de la publicité" sub="Google Ads, Meta Ads" selected={answers.priorites.includes("pub")} onClick={() => toggleMulti("pub")} />
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

        {/* STEP 5: Budget */}
        {currentStep === "budget" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre budget</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              Quel budget mensuel <em style={{ color: "#2563eb", fontStyle: "italic" }}>envisagez-vous</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Hors prestations uniques (création site, audit…). On ajuste l'intensité.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChoiceButton label="~50€/mois" sub="L'essentiel pour exister en ligne" selected={answers.budget === "50"} onClick={() => pickSingle("budget", "50")} />
              <ChoiceButton label="~100€/mois" sub="Une présence active et régulière" selected={answers.budget === "100"} onClick={() => pickSingle("budget", "100")} />
              <ChoiceButton label="150€+/mois" sub="Visibilité maximale, tout est géré" selected={answers.budget === "150"} onClick={() => pickSingle("budget", "150")} />
              <ChoiceButton label="Je ne sais pas" sub="Recommandez-moi le meilleur rapport qualité/prix" selected={answers.budget === "auto"} onClick={() => pickSingle("budget", "auto")} />
            </div>
          </div>
        )}

        {/* STEP 6: Resultat */}
        {currentStep === "resultat" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Votre estimation</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 500, marginBottom: 8, letterSpacing: "-0.02em" }}>
              Voici ce qu'on vous <em style={{ color: "#2563eb", fontStyle: "italic" }}>recommande</em>
            </h2>
            <p style={{ color: "#4a5568", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
              Cliquez sur une prestation pour l'ajouter ou la retirer.
            </p>

            {/* Totaux */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              {totalUnique > 0 && (
                <div style={{ flex: 1, padding: "18px 20px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Mise en place</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: "#0f1b2e" }}>{totalUnique}€</div>
                </div>
              )}
              {finalMensuel > 0 && (
                <div style={{ flex: 1, padding: "18px 20px", borderRadius: 14, background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)" }}>
                  <div style={{ fontSize: 11, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Par mois</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: "#2563eb" }}>
                    {finalMensuel}€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span>
                  </div>
                  {remise > 0 && <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginTop: 4 }}>-5% combo ({remise}€ d'économie)</div>}
                </div>
              )}
            </div>

            {/* Liste des prestas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recommended.map(id => {
                const item = CATALOGUE[id];
                if (!item) return null;
                const isRemoved = removed[id];
                return (
                  <button
                    key={id}
                    onClick={() => toggleRemove(id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", borderRadius: 10,
                      border: `1px solid ${isRemoved ? "#f1f5f9" : "#e2e8f0"}`,
                      background: isRemoved ? "#fafafa" : "#fff",
                      cursor: "pointer", fontFamily: "inherit",
                      opacity: isRemoved ? 0.4 : 1,
                      transition: "all 0.3s ease",
                      textAlign: "left", width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        border: `1.5px solid ${isRemoved ? "#e2e8f0" : "#2563eb"}`,
                        background: isRemoved ? "#fff" : "#2563eb",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {!isRemoved && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#0f1b2e", textDecoration: isRemoved ? "line-through" : "none" }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isRemoved ? "#94a3b8" : "#2563eb" }}>{item.price}€</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 500 }}>{item.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={goNext}
              style={{
                marginTop: 32, width: "100%", padding: "16px",
                borderRadius: 12, border: "none", fontFamily: "inherit",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                background: "#0f1b2e", color: "#fff",
                transition: "all 0.3s ease",
              }}
            >
              Recevoir cette estimation
            </button>
          </div>
        )}

        {/* STEP 7: Contact */}
        {currentStep === "contact" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Contact</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 500, marginBottom: 12, letterSpacing: "-0.02em" }}>
              On en <em style={{ color: "#2563eb", fontStyle: "italic" }}>discute</em> ?
            </h2>
            <p style={{ color: "#4a5568", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
              Je vous recontacte sous 24h avec un devis personnalisé.
            </p>

            {/* Resume rapide */}
            <div style={{ padding: "18px 20px", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#4a5568" }}>{activeItems.length} prestations recommandées</span>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {totalUnique > 0 && (
                  <div>
                    <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Unique </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#0f1b2e" }}>{totalUnique}€</span>
                  </div>
                )}
                {finalMensuel > 0 && (
                  <div>
                    <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mensuel </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#2563eb" }}>{finalMensuel}€/mois</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Nom de votre établissement"
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
                type="email"
                placeholder="Votre email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                style={{
                  width: "100%", padding: "14px 16px",
                  borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#0f1b2e",
                  fontFamily: "inherit", fontSize: 15,
                  transition: "border-color 0.2s ease",
                }}
              />
              <button
                style={{
                  marginTop: 8, width: "100%", padding: "16px",
                  borderRadius: 12, border: "none", fontFamily: "inherit",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  background: "#0f1b2e", color: "#fff",
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                Envoyer ma demande
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
              Estimation indicative, sans engagement. Devis personnalisé après échange.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
