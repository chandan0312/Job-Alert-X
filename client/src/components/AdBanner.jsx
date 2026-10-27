/**
 * AdBanner.jsx — Smart Ad placement wrapper for Job Alert X
 *
 * Usage:
 *   <AdBanner variant="horizontal" />   — Leaderboard / after-content banner
 *   <AdBanner variant="sidebar" />      — Sidebar rectangle
 *   <AdBanner variant="infeed" />       — In-feed between job listings
 *   <AdBanner variant="inarticle" />    — Mid-article native ad
 *
 * Replace the slot IDs below with your actual AdSense slot IDs from:
 * https://adsense.google.com → Ads → By ad unit
 *
 * IMPORTANT: AdSense only shows ads after your site is approved.
 * During review, the <ins> element renders but shows no visible content.
 * Do NOT use placeholder content inside the ad unit — it violates policy.
 */

import AdSense from './AdSense.jsx'

// ── Replace these with your real ad slot IDs from AdSense dashboard ──────────
const AD_SLOTS = {
  horizontal: '1234567890',   // Leaderboard 728x90 / Responsive banner
  sidebar:    '0987654321',   // Rectangle 300x250 sidebar unit
  infeed:     '1122334455',   // In-feed / native ad
  inarticle:  '5544332211',   // In-article / native ad
}

const VARIANT_CONFIG = {
  horizontal: {
    format: 'auto',
    responsive: true,
    style: { minHeight: 90 },
    className: 'my-5 w-full',
  },
  sidebar: {
    format: 'auto',
    responsive: true,
    style: { minHeight: 250 },
    className: 'my-4 w-full',
  },
  infeed: {
    format: 'fluid',
    responsive: true,
    layoutKey: '-6t+ed+2i-1n-4w',
    style: { minHeight: 100 },
    className: 'my-4 w-full',
  },
  inarticle: {
    format: 'fluid',
    responsive: true,
    layoutKey: '-fb+5w+4e-db+86',
    style: { minHeight: 120 },
    className: 'my-6 w-full',
  },
}

export default function AdBanner({ variant = 'horizontal' }) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.horizontal
  const slot = AD_SLOTS[variant] || AD_SLOTS.horizontal

  return (
    <AdSense
      slot={slot}
      format={config.format}
      responsive={config.responsive}
      layoutKey={config.layoutKey}
      style={config.style}
      className={config.className}
    />
  )
}
