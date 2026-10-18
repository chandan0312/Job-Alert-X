import { useEffect, useRef } from 'react'

/**
 * Reusable Google AdSense Ad Unit Component.
 * Automatically pushes to window.adsbygoogle and handles errors / adblockers gracefully.
 *
 * @param {string} slot - Ad unit slot ID from Google AdSense dashboard
 * @param {string} [format='auto'] - Ad format (e.g., 'auto', 'fluid', 'rectangle')
 * @param {boolean} [responsive=true] - Whether full-width responsive ad is enabled
 * @param {string} [layoutKey] - In-feed / in-article layout key if applicable
 * @param {string} [className=''] - Additional CSS classes
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

  useEffect(() => {
    // Only attempt to push once when mounted and in browser
    if (isPushed.current) return

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
  }, [])

  return (
    <div
      ref={adRef}
      className={`adsense-wrapper overflow-hidden my-4 text-center ${className}`}
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
