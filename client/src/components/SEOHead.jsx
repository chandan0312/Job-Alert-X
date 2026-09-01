// ---------------------------------------------------------------------------
// SEOHead — per-page SEO management using document APIs.
// ---------------------------------------------------------------------------
// Updates document.title and meta tags dynamically for each page.
// ---------------------------------------------------------------------------

import { useEffect } from 'react'

const SITE_NAME = 'Job Alert X'
const DEFAULT_DESCRIPTION =
  'Job Alert X — India\'s #1 Government Jobs Portal. Latest sarkari naukri, SSC, UPSC, Railway, Banking jobs, admit cards, results, answer keys and syllabus updates.'

/**
 * @param {object} props
 * @param {string} props.title         — Page title (appended with site name)
 * @param {string} [props.description] — Meta description
 * @param {string} [props.canonical]   — Canonical URL
 * @param {string} [props.ogImage]     — Open Graph image URL
 * @param {string} [props.ogType]      — Open Graph type (default: website)
 * @param {object} [props.jsonLd]      — JSON-LD structured data object
 */
export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
}) {
  useEffect(() => {
    // Document title
    const fullTitle = title ? `${title} | ${SITE_NAME} — Government Jobs Portal` : `${SITE_NAME} — Government Jobs Portal`
    document.title = fullTitle

    // Helper to set/create a meta tag
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Standard meta
    setMeta('name', 'description', description)

    // Open Graph
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', ogType)
    if (canonical) setMeta('property', 'og:url', canonical)
    if (ogImage) setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:site_name', SITE_NAME)

    // Twitter Card
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    if (ogImage) setMeta('name', 'twitter:image', ogImage)

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', canonical)
    } else if (canonicalEl) {
      canonicalEl.remove()
    }

    // JSON-LD
    const scriptId = 'seo-json-ld'
    let scriptEl = document.getElementById(scriptId)
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.id = scriptId
        scriptEl.type = 'application/ld+json'
        document.head.appendChild(scriptEl)
      }
      scriptEl.textContent = JSON.stringify(jsonLd)
    } else if (scriptEl) {
      scriptEl.remove()
    }

    // Cleanup
    return () => {
      const ldScript = document.getElementById(scriptId)
      if (ldScript) ldScript.remove()
    }
  }, [title, description, canonical, ogImage, ogType, jsonLd])

  return null
}
