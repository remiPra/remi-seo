export const prerender = false;

import { load } from "cheerio";
import { analyzeText } from "../../lib/ai-detector.js";

export async function POST({ request }) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL manquante" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Valider l'URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return new Response(JSON.stringify({ error: "URL invalide" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch la page
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOVision/1.0; +https://remi-seo.fr)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Erreur HTTP ${response.status}` }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = await response.text();

    // Extraire le texte avec cheerio
    const $ = load(html);

    // Supprimer les éléments non-textuels
    $("script, style, nav, footer, header, aside, noscript, iframe, svg, form, [role='navigation'], [role='banner'], [role='contentinfo']").remove();

    // Récupérer le titre
    const title = $("title").text().trim() || $("h1").first().text().trim() || "";

    // Extraire le contenu principal
    const mainSelector = $("main, article, [role='main'], .content, .post-content, .entry-content, #content").first();
    const contentEl = mainSelector.length ? mainSelector : $("body");

    const textContent = contentEl
      .find("p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(t => t.length > 10)
      .join("\n\n");

    if (textContent.length < 100) {
      return new Response(JSON.stringify({ error: "Pas assez de contenu texte sur cette page" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Analyser
    const result = analyzeText(textContent);

    return new Response(JSON.stringify({
      url: parsedUrl.toString(),
      title,
      ...result,
      textPreview: textContent.slice(0, 500),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err.name === "TimeoutError" ? "Timeout : la page met trop de temps à répondre" : `Erreur : ${err.message}`;
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
