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
 *
 * AD PLACEMENT GUIDELINES FOR ADSENSE COMPLIANCE:
 * - Never place ads near interactive elements (buttons, links, forms)
 * - Maintain minimum 150px distance from content above/below
 * - Label ads clearly as "Advertisement" or "Sponsored"
 * - Don't exceed 3 ad units per page for optimal UX
 * - Use responsive ad units for mobile-friendly experience
 */

import AdSense from './AdSense.jsx'

// ── Replace these with your real ad slot IDs from AdSense dashboard ──────────
// After AdSense approval, update these with actual slot IDs from your dashboard
const AD_SLOTS = {
  horizontal: process.env.REACT_APP_ADSLOT_HORIZONTAL || '',   // Leaderboard 728x90 / Responsive banner
  sidebar:    process.env.REACT_APP_ADSLOT_SIDEBAR || '',      // Rectangle 300x250 sidebar unit
  infeed:     process.env.REACT_APP_ADSLOT_INFEED || '',       // In-feed / native ad
  inarticle:  process.env.REACT_APP_ADSLOT_INARTICLE || '',    // In-article / native ad
}

const VARIANT_CONFIG = {
  horizontal: {
    format: 'auto',
    responsive: true,
    style: { minHeight: 90 },
    className: 'my-5 w-full',
    label: 'Advertisement',
  },
  sidebar: {
    format: 'auto',
    responsive: true,
    style: { minHeight: 250 },
    className: 'my-4 w-full',
    label: 'Advertisement',
  },
  infeed: {
    format: 'fluid',
    responsive: true,
    layoutKey: '-6t+ed+2i-1n-4w',
    style: { minHeight: 100 },
    className: 'my-4 w-full',
    label: 'Sponsored',
  },
  inarticle: {
    format: 'fluid',
    responsive: true,
    layoutKey: '-fb+5w+4e-db+86',
    style: { minHeight: 120 },
    className: 'my-6 w-full',
    label: 'Sponsored',
  },
}

export default function AdBanner({ variant = 'horizontal' }) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.horizontal
  const slot = AD_SLOTS[variant] || AD_SLOTS.horizontal

  // Don't render anything if no slot ID is configured (pre-approval)
  if (!slot) {
    return null
  }

  return (
    <div className="ad-banner-wrapper" role="complementary" aria-label={config.label}>
      <div className="text-[10px] font-medium text-ink-faint uppercase tracking-wider mb-1 px-1" aria-hidden="true">
        {config.label}
      </div>
      <AdSense
        slot={slot}
        format={config.format}
        responsive={config.responsive}
        layoutKey={config.layoutKey}
        style={config.style}
        className={config.className}
      />
    </div>
  )
}
