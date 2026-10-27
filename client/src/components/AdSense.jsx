import { useEffect, useRef } from 'react'

/**
 * Reusable Google AdSense Ad Unit Component.
 * Automatically pushes to window.adsbygoogle and handles errors / adblockers gracefully.
 *
 * @param {string}  slot         - Ad unit slot ID from Google AdSense dashboard
 * @param {string}  [format]     - Ad format: 'auto' | 'fluid' | 'rectangle' | 'horizontal'
 * @param {boolean} [responsive] - Whether full-width responsive ad is enabled
 * @param {string}  [layoutKey]  - In-feed / in-article layout key if applicable
 * @param {string}  [className]  - Additional CSS classes
 * @param {object}  [style]      - Inline style override
 */
export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  layoutKey,
  className = '',
  style = {},
}) {
  const adRef = useRef(null)
  const isPushed = useRef(false)

  // Guard against dummy placeholder slots or empty slots during pre-approval review
  const isPlaceholder = !slot || /^(1234567890|0987654321|1122334455|5544332211|PLACEHOLDER)$/i.test(slot.trim())

  useEffect(() => {
    // Only attempt to push once when mounted, in browser, and when a genuine slot ID is present
    if (isPushed.current || isPlaceholder) return

    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        isPushed.current = true
      }
    } catch (err) {
      // Gracefully ignore adblockers or duplicate pushes
      console.debug('[AdSense] Ad push suppressed:', err?.message)
    }
  }, [isPlaceholder])

  // While awaiting AdSense approval or before slot IDs are inserted,
  // do not render empty broken containers that could trigger "site under construction" flags.
  if (isPlaceholder) {
    return null
  }

  return (
    <div
      ref={adRef}
      className={`adsense-wrapper overflow-hidden text-center ${className}`}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-3267638418796867"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  )
}
