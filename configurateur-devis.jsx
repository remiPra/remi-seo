import { useState, useEffect, useRef } from "react";

const SERVICES = [
  {
    category: "Google My Business",
    icon: "📍",
    items: [
      { id: "gmb_creation", name: "Création / revendication de fiche", price: 49, type: "unique", desc: "On crée ou récupère votre fiche Google" },
      { id: "gmb_optim", name: "Optimisation complète de la fiche", price: 99, type: "unique", desc: "Catégories, description, attributs, horaires" },
      { id: "gmb_gestion", name: "Gestion mensuelle de la fiche", price: 39, type: "mensuel", desc: "Mise à jour infos, horaires, photos" },
      { id: "gmb_posts3", name: "Pack 2-3 posts Google/mois", price: 25, type: "mensuel", desc: "Publications régulières sur votre fiche" },
      { id: "gmb_posts5", name: "Pack 4-5 posts Google/mois", price: 39, type: "mensuel", desc: "Publications fréquentes sur votre fiche" },
      { id: "gmb_avis", name: "Réponse aux avis Google", price: 25, type: "mensuel", desc: "Réponses personnalisées à tous vos avis" },
      { id: "gmb_rapport", name: "Rapport mensuel de performance", price: 15, type: "mensuel", desc: "Vues, clics, appels, itinéraires" },
    ]
  },
  {
    category: "Site Web",
    icon: "🌐",
    items: [
      { id: "site_5", name: "Site vitrine (1 à 5 pages)", price: 800, type: "unique", desc: "Design, contenu, responsive, SEO de base" },
      { id: "site_10", name: "Site vitrine (6 à 10 pages)", price: 1200, type: "unique", desc: "Site complet avec pages supplémentaires" },
      { id: "site_refonte", name: "Refonte de site existant", price: 800, type: "unique", desc: "Modernisation et optimisation" },
      { id: "site_maintenance", name: "Maintenance mensuelle", price: 29, type: "mensuel", desc: "Mises à jour, sécurité, sauvegardes" },
      { id: "site_page", name: "Ajout d'une page", price: 79, type: "unique", desc: "Rédaction + intégration + SEO" },
      { id: "site_resa", name: "Module réservation en ligne", price: 149, type: "unique", desc: "Intégration système de réservation" },
      { id: "site_commande", name: "Module commande en ligne", price: 249, type: "unique", desc: "Click & collect ou livraison" },
      { id: "site_hebergement", name: "Hébergement + nom de domaine", price: 15, type: "mensuel", desc: "Gestion technique complète" },
    ]
  },
  {
    category: "Référencement SEO",
    icon: "🔍",
    items: [
      { id: "seo_audit", name: "Audit SEO complet", price: 149, type: "unique", desc: "Analyse technique, mots-clés, contenu" },
      { id: "seo_onpage", name: "Optimisation SEO on-page", price: 99, type: "unique", desc: "Balises, titres, méta, maillage" },
      { id: "seo_article1", name: "1 article de blog SEO/mois", price: 35, type: "mensuel", desc: "Publication mensuelle ciblée" },
      { id: "seo_article2", name: "2 articles de blog SEO/mois", price: 59, type: "mensuel", desc: "Publications bimensuelles" },
      { id: "seo_motscles", name: "Recherche de mots-clés locaux", price: 69, type: "unique", desc: "Étude des recherches dans votre zone" },
      { id: "seo_suivi", name: "Suivi de positionnement mensuel", price: 15, type: "mensuel", desc: "Rapport de classement Google" },
      { id: "seo_annuaires", name: "Inscription annuaires locaux", price: 59, type: "unique", desc: "PagesJaunes, Yelp, TripAdvisor…" },
    ]
  },
  {
    category: "Réseaux Sociaux",
    icon: "📱",
    items: [
      { id: "social_insta_creation", name: "Création compte Instagram", price: 49, type: "unique", desc: "Profil, bio, visuels de lancement" },
      { id: "social_fb_creation", name: "Création page Facebook", price: 49, type: "unique", desc: "Page pro complète" },
      { id: "social_tiktok_creation", name: "Création compte TikTok", price: 59, type: "unique", desc: "Profil + premières vidéos" },
      { id: "social_pack4", name: "Pack 4 posts/mois", price: 49, type: "mensuel", desc: "1 publication par semaine" },
      { id: "social_pack8", name: "Pack 8 posts/mois", price: 89, type: "mensuel", desc: "2 publications par semaine" },
      { id: "social_mix", name: "Pack 4 posts + 4 stories/mois", price: 59, type: "mensuel", desc: "Mix posts et stories" },
      { id: "social_insta_full", name: "Gestion complète Instagram", price: 99, type: "mensuel", desc: "Posts + stories + reels + interaction" },
      { id: "social_fb_full", name: "Gestion complète Facebook", price: 79, type: "mensuel", desc: "Publications + réponses + événements" },
      { id: "social_multi", name: "Gestion multi-plateformes", price: 149, type: "mensuel", desc: "Instagram + Facebook + TikTok" },
    ]
  },
  {
    category: "Création Visuelle",
    icon: "🎨",
    items: [
      { id: "visual_1", name: "Visuel IA (à l'unité)", price: 15, type: "unique", desc: "Photo réaliste, mise en scène pro" },
      { id: "visual_4", name: "Pack 4 visuels IA", price: 49, type: "unique", desc: "Cohérence graphique" },
      { id: "visual_8", name: "Pack 8 visuels IA", price: 79, type: "unique", desc: "Pour publications fréquentes" },
      { id: "visual_10", name: "Pack 10 visuels IA", price: 99, type: "unique", desc: "Lot complet pour lancement" },
      { id: "visual_template", name: "Template réutilisable", price: 39, type: "unique", desc: "Modèle aux couleurs du client" },
      { id: "visual_video_court", name: "Montage vidéo courte (< 30s)", price: 25, type: "unique", desc: "Reel, TikTok, story" },
      { id: "visual_video_long", name: "Montage vidéo (30s - 2min)", price: 59, type: "unique", desc: "Présentation, témoignage" },
      { id: "visual_menu", name: "Création menu / carte PDF", price: 69, type: "unique", desc: "Design pro de votre menu" },
      { id: "visual_flyer", name: "Création flyer / support print", price: 69, type: "unique", desc: "Design A5 ou A4" },
    ]
  },
  {
    category: "Avis Clients",
    icon: "⭐",
    items: [
      { id: "avis_qr_google", name: "QR Code avis Google", price: 19, type: "unique", desc: "QR Code + support imprimable" },
      { id: "avis_qr_trip", name: "QR Code TripAdvisor", price: 19, type: "unique", desc: "QR Code + support imprimable" },
      { id: "avis_qr_pack", name: "Pack QR Codes multi-plateformes", price: 39, type: "unique", desc: "Google + TripAdvisor + autre" },
      { id: "avis_strategie", name: "Stratégie de collecte d'avis", price: 39, type: "unique", desc: "Mise en place du process complet" },
      { id: "avis_gestion_google", name: "Gestion avis Google", price: 25, type: "mensuel", desc: "Réponses personnalisées" },
      { id: "avis_gestion_multi", name: "Gestion avis multi-plateformes", price: 39, type: "mensuel", desc: "Google + TripAdvisor + autre" },
      { id: "avis_veille", name: "Veille e-réputation", price: 19, type: "mensuel", desc: "Suivi note, alertes, rapport" },
    ]
  },
  {
    category: "Plateformes Spécialisées",
    icon: "🏨",
    items: [
      { id: "plat_tripadvisor", name: "Optimisation fiche TripAdvisor", price: 49, type: "unique", desc: "Profil complet, photos, infos" },
      { id: "plat_thefork", name: "Optimisation fiche TheFork", price: 49, type: "unique", desc: "Profil + menu + photos" },
      { id: "plat_booking", name: "Optimisation fiche Booking", price: 59, type: "unique", desc: "Pour hôtels / hébergements" },
      { id: "plat_airbnb", name: "Optimisation fiche Airbnb", price: 79, type: "unique", desc: "Annonce complète + photos + texte" },
      { id: "plat_gestion_thefork", name: "Gestion mensuelle TheFork", price: 29, type: "mensuel", desc: "Mises à jour, offres, suivi" },
      { id: "plat_gestion_booking", name: "Gestion mensuelle Booking", price: 29, type: "mensuel", desc: "Tarifs, mises à jour, réponses" },
    ]
  },
  {
    category: "Audit & Consulting",
    icon: "📊",
    items: [
      { id: "audit_complet", name: "Audit stratégie digitale complet", price: 249, type: "unique", desc: "Google + site + réseaux + avis + concurrence" },
      { id: "audit_gmb", name: "Audit Google My Business", price: 79, type: "unique", desc: "Analyse fiche + recommandations" },
      { id: "audit_social", name: "Audit réseaux sociaux", price: 79, type: "unique", desc: "Analyse présence + recommandations" },
      { id: "audit_seo", name: "Audit SEO", price: 99, type: "unique", desc: "Technique + mots-clés + contenu" },
      { id: "formation_gmb", name: "Formation Google My Business (1h)", price: 49, type: "unique", desc: "Apprenez à gérer votre fiche" },
      { id: "formation_social", name: "Formation réseaux sociaux (1h)", price: 49, type: "unique", desc: "Les bases Instagram / Facebook" },
      { id: "consulting", name: "Consulting stratégique (1h)", price: 39, type: "unique", desc: "Session de conseil personnalisé" },
    ]
  },
  {
    category: "Publicité en Ligne",
    icon: "📣",
    items: [
      { id: "ads_google_creation", name: "Création campagne Google Ads", price: 99, type: "unique", desc: "Configuration + ciblage + annonces" },
      { id: "ads_google_gestion", name: "Gestion mensuelle Google Ads", price: 49, type: "mensuel", desc: "Optimisation + rapport (hors budget pub)" },
      { id: "ads_meta_creation", name: "Création campagne Meta Ads", price: 99, type: "unique", desc: "Configuration + visuels + ciblage" },
      { id: "ads_meta_gestion", name: "Gestion mensuelle Meta Ads", price: 49, type: "mensuel", desc: "Optimisation + rapport (hors budget pub)" },
    ]
  }
];

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700&display=swap');
`;

export default function App() {
  const [selected, setSelected] = useState({});
  const [openCat, setOpenCat] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [step, setStep] = useState("hero");
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [animateTotal, setAnimateTotal] = useState(false);
  const configRef = useRef(null);

  const toggle = (id) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
    setAnimateTotal(true);
    setTimeout(() => setAnimateTotal(false), 400);
  };

  const allItems = SERVICES.flatMap(c => c.items);
  const selectedItems = allItems.filter(i => selected[i.id]);
  const totalUnique = selectedItems.filter(i => i.type === "unique").reduce((s, i) => s + i.price, 0);
  const totalMensuel = selectedItems.filter(i => i.type === "mensuel").reduce((s, i) => s + i.price, 0);
  const count = selectedItems.length;

  const scrollToConfig = () => {
    setStep("config");
    setTimeout(() => configRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0A0A0B", color: "#F0EDE8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{fonts}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #E8A838; color: #0A0A0B; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.8s ease 0.1s forwards; opacity: 0; }
        .fade-up-d2 { animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0; }
        .fade-up-d3 { animation: fadeUp 0.8s ease 0.3s forwards; opacity: 0; }
        .fade-up-d4 { animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0; }
        .total-pop { animation: pulse 0.4s ease; }
        .cat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,168,56,0.12); }
        .item-row:hover { background: rgba(232,168,56,0.06) !important; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,168,56,0.3); }
        .ghost-btn:hover { background: rgba(232,168,56,0.1); }
        .hero-gradient { background: linear-gradient(135deg, #E8A838, #D4772C, #E8A838); background-size: 200% 200%; animation: gradientMove 4s ease infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grain { position: fixed; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        input:focus, textarea:focus { outline: none; border-color: #E8A838 !important; }
        @media (max-width: 640px) { .hero-title { font-size: 2.2rem !important; } .hero-sub { font-size: 1rem !important; } }
      `}</style>
      <div className="grain" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(10,10,11,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(240,237,232,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #E8A838, #D4772C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#0A0A0B" }}>R</div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>Rémi</span>
        </div>
        <button onClick={scrollToConfig} className="cta-btn" style={{ padding: "8px 20px", background: "#E8A838", color: "#0A0A0B", border: "none", borderRadius: 8, fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.3s ease" }}>
          Estimer mon projet →
        </button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,168,56,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,119,44,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(232,168,56,0.25)", marginBottom: 32, fontSize: 13, color: "#E8A838", fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A838" }} />
          Développeur web & Référencement — Aix-en-Provence
        </div>

        <h1 className="hero-title fade-up-d1" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.2rem, 6vw, 4.2rem)", fontWeight: 900, lineHeight: 1.08, maxWidth: 800, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Vos clients vous cherchent sur Google.
          <br />
          <span className="hero-gradient">Est-ce qu'ils vous trouvent ?</span>
        </h1>

        <p className="hero-sub fade-up-d2" style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(240,237,232,0.55)", maxWidth: 540, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          Je rends votre établissement visible en ligne. Site web, Google, Instagram, avis clients — tout ce qu'il faut pour que vos futurs clients vous trouvent avant vos concurrents.
        </p>

        <div className="fade-up-d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={scrollToConfig} className="cta-btn" style={{ padding: "16px 36px", background: "#E8A838", color: "#0A0A0B", border: "none", borderRadius: 12, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.3s ease" }}>
            Estimer mon projet gratuitement
          </button>
          <button onClick={scrollToConfig} className="ghost-btn" style={{ padding: "16px 36px", background: "transparent", color: "#F0EDE8", border: "1px solid rgba(240,237,232,0.15)", borderRadius: 12, fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 16, cursor: "pointer", transition: "all 0.3s ease" }}>
            Voir les prestations
          </button>
        </div>

        <div className="fade-up-d4" style={{ display: "flex", gap: 40, marginTop: 72, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { n: "Google", d: "Fiche optimisée & posts" },
            { n: "Site Web", d: "Création & référencement" },
            { n: "Instagram", d: "Visuels IA & gestion" },
            { n: "Avis", d: "Collecte & e-réputation" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#E8A838", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)", fontWeight: 300 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONFIGURATOR */}
      <section ref={configRef} style={{ padding: "80px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Composez votre offre <span style={{ color: "#E8A838" }}>sur mesure</span>
          </h2>
          <p style={{ color: "rgba(240,237,232,0.45)", fontSize: 15, maxWidth: 500, margin: "0 auto", fontWeight: 300 }}>
            Sélectionnez les prestations qui vous intéressent. Le devis se calcule en temps réel.
          </p>
        </div>

        {/* CATEGORIES */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SERVICES.map((cat, ci) => {
            const isOpen = openCat === ci;
            const catSelected = cat.items.filter(i => selected[i.id]).length;
            return (
              <div key={ci} className="cat-card" style={{ background: isOpen ? "rgba(232,168,56,0.04)" : "rgba(240,237,232,0.02)", border: `1px solid ${isOpen ? "rgba(232,168,56,0.2)" : "rgba(240,237,232,0.06)"}`, borderRadius: 16, transition: "all 0.3s ease", overflow: "hidden" }}>
                <button onClick={() => setOpenCat(isOpen ? null : ci)} style={{ width: "100%", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", color: "#F0EDE8", fontFamily: "'Sora', sans-serif" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{cat.category}</span>
                    {catSelected > 0 && (
                      <span style={{ padding: "2px 10px", borderRadius: 100, background: "#E8A838", color: "#0A0A0B", fontSize: 11, fontWeight: 700 }}>{catSelected}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 20, transition: "transform 0.3s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", color: "rgba(240,237,232,0.3)" }}>+</span>
                </button>
                
                {isOpen && (
                  <div style={{ padding: "0 12px 12px" }}>
                    {cat.items.map((item, ii) => {
                      const isSelected = selected[item.id];
                      return (
                        <div key={ii} className="item-row" onClick={() => toggle(item.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s ease", background: isSelected ? "rgba(232,168,56,0.08)" : "transparent", animation: `slideIn 0.3s ease ${ii * 0.04}s forwards`, opacity: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? "#E8A838" : "rgba(240,237,232,0.15)"}`, background: isSelected ? "#E8A838" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease", flexShrink: 0 }}>
                              {isSelected && <span style={{ color: "#0A0A0B", fontSize: 13, fontWeight: 800 }}>✓</span>}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: isSelected ? "#F0EDE8" : "rgba(240,237,232,0.7)", transition: "all 0.2s ease" }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: "rgba(240,237,232,0.3)", marginTop: 2, fontWeight: 300 }}>{item.desc}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? "#E8A838" : "rgba(240,237,232,0.5)" }}>{item.price}€</div>
                            <div style={{ fontSize: 10, color: "rgba(240,237,232,0.3)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{item.type}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* STICKY TOTAL BAR */}
      {count > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,11,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(232,168,56,0.15)", padding: "14px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "rgba(240,237,232,0.5)" }}>
                <span style={{ fontWeight: 700, color: "#E8A838" }}>{count}</span> prestation{count > 1 ? "s" : ""}
              </span>
              {totalUnique > 0 && (
                <div className={animateTotal ? "total-pop" : ""}>
                  <span style={{ fontSize: 11, color: "rgba(240,237,232,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unique </span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#F0EDE8", fontFamily: "'Outfit', sans-serif" }}>{totalUnique}€</span>
                </div>
              )}
              {totalMensuel > 0 && (
                <div className={animateTotal ? "total-pop" : ""}>
                  <span style={{ fontSize: 11, color: "rgba(240,237,232,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mensuel </span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#E8A838", fontFamily: "'Outfit', sans-serif" }}>{totalMensuel}€<span style={{ fontSize: 12, fontWeight: 400 }}>/mois</span></span>
                </div>
              )}
            </div>
            <button onClick={() => setShowSummary(true)} className="cta-btn" style={{ padding: "10px 24px", background: "#E8A838", color: "#0A0A0B", border: "none", borderRadius: 10, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s ease" }}>
              Voir mon récapitulatif →
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY MODAL */}
      {showSummary && (
        <div onClick={() => setShowSummary(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#141415", border: "1px solid rgba(232,168,56,0.15)", borderRadius: 20, maxWidth: 600, width: "100%", maxHeight: "85vh", overflow: "auto", padding: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800 }}>Votre estimation</h3>
              <button onClick={() => setShowSummary(false)} style={{ background: "none", border: "none", color: "rgba(240,237,232,0.4)", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>

            {SERVICES.map((cat, ci) => {
              const items = cat.items.filter(i => selected[i.id]);
              if (!items.length) return null;
              return (
                <div key={ci} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E8A838", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{cat.icon} {cat.category}</div>
                  {items.map((item, ii) => (
                    <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(240,237,232,0.04)" }}>
                      <span style={{ fontSize: 14, color: "rgba(240,237,232,0.75)" }}>{item.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#F0EDE8", whiteSpace: "nowrap", marginLeft: 16 }}>{item.price}€ <span style={{ fontSize: 10, color: "rgba(240,237,232,0.3)" }}>{item.type}</span></span>
                    </div>
                  ))}
                </div>
              );
            })}

            <div style={{ borderTop: "2px solid rgba(232,168,56,0.2)", paddingTop: 20, marginTop: 12 }}>
              {totalUnique > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 15, color: "rgba(240,237,232,0.6)" }}>Total prestations uniques</span>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{totalUnique}€</span>
                </div>
              )}
              {totalMensuel > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, color: "rgba(240,237,232,0.6)" }}>Total mensuel</span>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#E8A838" }}>{totalMensuel}€/mois</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 28, padding: 20, background: "rgba(232,168,56,0.06)", borderRadius: 12, border: "1px solid rgba(232,168,56,0.1)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#E8A838", marginBottom: 12 }}>Recevoir cette estimation</div>
              <input type="text" placeholder="Nom de votre établissement" value={businessName} onChange={e => setBusinessName(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "rgba(240,237,232,0.05)", border: "1px solid rgba(240,237,232,0.1)", borderRadius: 8, color: "#F0EDE8", fontFamily: "'Sora', sans-serif", fontSize: 14, marginBottom: 8, transition: "border-color 0.2s ease" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <input type="email" placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: "10px 14px", background: "rgba(240,237,232,0.05)", border: "1px solid rgba(240,237,232,0.1)", borderRadius: 8, color: "#F0EDE8", fontFamily: "'Sora', sans-serif", fontSize: 14, transition: "border-color 0.2s ease" }} />
                <button className="cta-btn" style={{ padding: "10px 20px", background: "#E8A838", color: "#0A0A0B", border: "none", borderRadius: 8, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap" }}>
                  Envoyer →
                </button>
              </div>
            </div>

            <p style={{ fontSize: 11, color: "rgba(240,237,232,0.25)", textAlign: "center", marginTop: 16, fontWeight: 300 }}>
              Cette estimation est indicative et sans engagement. Un devis personnalisé vous sera envoyé après échange.
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "80px 24px 120px", textAlign: "center" }}>
        <p style={{ color: "rgba(240,237,232,0.2)", fontSize: 13, fontWeight: 300 }}>
          © 2026 Rémi — Développeur web & Référencement — Aix-en-Provence
        </p>
      </footer>
    </div>
  );
}
