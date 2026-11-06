import { useEffect, useState } from 'react'

/**
 * Core Skeleton primitive — animates a subtle pulse.
 * Use `className` to size and position; `variant` chooses color tone.
 */
function SkeletonPrimitive({
  className = '',
  variant = 'default', // 'default' | 'muted' | 'brand' | 'surface'
  animation = 'pulse', // 'pulse' | 'wave' | 'none'
  'aria-hidden': ariaHidden = 'true',
  ...props
}) {
  const base = 'rounded animate-skeleton'
  const variantClass =
    variant === 'muted'
      ? 'bg-subtle/80'
      : variant === 'brand'
      ? 'bg-brand-500/15'
      : variant === 'surface'
      ? 'bg-surface border border-hairline'
      : 'bg-subtle/90'
  const animClass = animation === 'wave' ? 'animate-skeleton-wave' : animation === 'pulse' ? 'animate-pulse' : ''
  return <div className={`${base} ${variantClass} ${animClass} ${className}`} aria-hidden={ariaHidden} {...props} />
}

/**
 * Text line skeleton — one or multiple lines.
 * @param {number} lines - number of lines to render
 * @param {string} width - width of last line (e.g., '60%', 'w-3/4')
 */
export function TextSkeleton({ lines = 3, width = '100%', className = '', variant = 'default' }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPrimitive
          key={i}
          variant={variant}
          className={i === lines - 1 ? `h-3.5 rounded w-[${width}]` : 'h-3.5 rounded w-full'}
        />
      ))}
    </div>
  )
}

/**
 * Card skeleton — mimics JobCard / PopularCard / AttentionCard structure.
 * @param {boolean} withImage - show image placeholder
 * @param {boolean} withMeta - show meta/date line
 * @param {string} variant - 'default' | 'horizontal' | 'compact'
 */
export function CardSkeleton({ withImage = true, withMeta = true, variant = 'default', className = '' }) {
  const isHorizontal = variant === 'horizontal'
  const isCompact = variant === 'compact'

  return (
    <div
      className={`
        card overflow-hidden transition-all duration-200
        ${isHorizontal ? 'flex flex-row items-start gap-4 p-4' : 'flex flex-col'}
        ${isCompact ? 'p-3' : 'p-4 sm:p-5'}
        ${className}
      `}
      aria-hidden="true"
    >
      {withImage && !isHorizontal && (
        <SkeletonPrimitive className="aspect-video w-full rounded-lg mb-3" variant="surface" />
      )}

      <div className={`${isHorizontal ? 'flex-1 min-w-0' : 'flex-1'} space-y-2`}>
        {/* Category badge */}
        <SkeletonPrimitive className="h-5 w-20 rounded-full" variant="brand" />

        {/* Title */}
        <SkeletonPrimitive className={`h-5 rounded ${isCompact ? 'w-3/4' : 'w-5/6'}`} variant="default" />
        <SkeletonPrimitive className={`h-4 rounded ${isCompact ? 'w-1/2' : 'w-1/3'}`} variant="muted" />

        {withMeta && (
          <div className="flex items-center gap-3">
            <SkeletonPrimitive className="h-3.5 w-16 rounded" variant="muted" />
            <SkeletonPrimitive className="h-3.5 w-20 rounded" variant="muted" />
            <SkeletonPrimitive className="h-3.5 w-16 rounded" variant="muted" />
          </div>
        )}

        {/* Action area placeholder */}
        {!isCompact && (
          <div className="pt-2 border-t border-hairline flex items-center justify-between">
            <SkeletonPrimitive className="h-8 w-28 rounded-lg" variant="brand" />
            <SkeletonPrimitive className="h-7 w-20 rounded-lg" variant="muted" />
          </div>
        )}
      </div>

      {withImage && isHorizontal && (
        <SkeletonPrimitive className="aspect-square w-36 sm:w-40 flex-shrink-0 rounded-lg" variant="surface" />
      )}
    </div>
  )
}

/**
 * Table row skeleton — for RecentJobsTable, CategoryBox, etc.
 * @param {number} cols - number of content columns (excluding action column)
 * @param {boolean} withAction - include action button placeholder
 */
export function TableRowSkeleton({ cols = 3, withAction = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 py-2 border-b border-hairline/60 last:border-b-0 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SkeletonPrimitive className="h-8 w-8 rounded-lg" variant="surface" />
        <div className="flex-1 space-y-1 min-w-0">
          <SkeletonPrimitive className="h-3.5 rounded w-3/5" variant="default" />
          <SkeletonPrimitive className="h-2.5 rounded w-1/3" variant="muted" />
        </div>
      </div>
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <SkeletonPrimitive key={i} className="h-3.5 w-20 rounded shrink-0" variant="muted" />
      ))}
      {withAction && <SkeletonPrimitive className="h-7 w-20 rounded-lg shrink-0" variant="muted" />}
    </div>
  )
}

/**
 * Table skeleton wrapper with header and multiple rows.
 */
export function TableSkeleton({ rows = 4, cols = 3, withHeader = true, className = '' }) {
  return (
    <div className={`rounded-2xl border border-hairline bg-surface ${className}`} aria-hidden="true">
      {withHeader && (
        <div className="h-4 bg-subtle/80 rounded w-1/4 mx-4 mb-3" />
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} withAction={true} />
      ))}
    </div>
  )
}

/**
 * List item skeleton — for simple list items with icon + text.
 */
export function ListItemSkeleton({ withIcon = true, lines = 2, className = '' }) {
  return (
    <div className={`flex items-start gap-3 py-2 ${className}`} aria-hidden="true">
      {withIcon && <SkeletonPrimitive className="h-8 w-8 shrink-0 rounded-lg" variant="surface" />}
      <div className="flex-1 space-y-1.5 min-w-0">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonPrimitive key={i} className={`h-3.5 rounded ${i === lines - 1 ? 'w-1/2' : 'w-3/4'}`} variant={i === 0 ? 'default' : 'muted'} />
        ))}
      </div>
    </div>
  )
}

/**
 * Hero / Banner skeleton — large promotional area.
 */
export function HeroSkeleton({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-hairline overflow-hidden ${className}`} aria-hidden="true">
      <SkeletonPrimitive className="aspect-[16/5] w-full" variant="surface" />
      <div className="p-4 sm:p-6 space-y-3">
        <SkeletonPrimitive className="h-5 w-24 rounded-full" variant="brand" />
        <SkeletonPrimitive className="h-8 w-3/4 rounded" variant="default" />
        <SkeletonPrimitive className="h-5 w-1/2 rounded" variant="muted" />
        <div className="flex gap-3 pt-2">
          <SkeletonPrimitive className="h-10 w-32 rounded-xl" variant="brand" />
          <SkeletonPrimitive className="h-10 w-32 rounded-xl" variant="muted" />
        </div>
      </div>
    </div>
  )
}

/**
 * Article / Blog post skeleton — for HomeArticlesSection, ArticleDetails.
 */
export function ArticleSkeleton({ className = '' }) {
  return (
    <article className={`card overflow-hidden ${className}`} aria-hidden="true">
      <SkeletonPrimitive className="aspect-video w-full" variant="surface" />
      <div className="p-4 sm:p-5 space-y-3">
        <SkeletonPrimitive className="h-5 w-24 rounded-full" variant="brand" />
        <SkeletonPrimitive className="h-6 w-5/6 rounded" variant="default" />
        <SkeletonPrimitive className="h-4 w-1/3 rounded" variant="muted" />
        <div className="space-y-2 pt-2 border-t border-hairline">
          <SkeletonPrimitive className="h-4 w-full rounded" variant="muted" />
          <SkeletonPrimitive className="h-4 w-4/5 rounded" variant="muted" />
          <SkeletonPrimitive className="h-4 w-3/5 rounded" variant="muted" />
        </div>
      </div>
    </article>
  )
}

/**
 * Sidebar widget skeleton — for RightSidebar components.
 */
export function SidebarWidgetSkeleton({ title = true, items = 4, className = '' }) {
  return (
    <div className={`card p-4 space-y-3 ${className}`} aria-hidden="true">
      {title && <SkeletonPrimitive className="h-5 w-1/3 rounded" variant="default" />}
      <div className="space-y-2.5">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <SkeletonPrimitive className="h-7 w-7 shrink-0 rounded" variant="surface" />
            <div className="flex-1 space-y-1 min-w-0">
              <SkeletonPrimitive className="h-3.5 rounded w-3/4" variant="default" />
              <SkeletonPrimitive className="h-2.5 rounded w-1/2" variant="muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Form field skeleton — for login, contact, search forms.
 */
export function FormFieldSkeleton({ withLabel = true, type = 'input', className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden="true">
      {withLabel && <SkeletonPrimitive className="h-3.5 w-1/4 rounded" variant="muted" />}
      <SkeletonPrimitive
        className={`rounded-xl ${type === 'textarea' ? 'h-24' : 'h-10'} w-full`}
        variant="surface"
      />
    </div>
  )
}

/**
 * Category pill / chip skeleton.
 */
export function ChipSkeleton({ count = 5, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPrimitive key={i} className="h-7 px-3 rounded-full" variant="muted" />
      ))}
    </div>
  )
}

/**
 * Stats row skeleton — for dashboard / stats sections.
 */
export function StatsRowSkeleton({ count = 4, className = '' }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border border-hairline bg-surface p-3">
          <SkeletonPrimitive className="h-8 w-8 shrink-0 rounded-lg" variant="brand" />
          <div className="flex-1 space-y-1">
            <SkeletonPrimitive className="h-5 rounded w-3/4" variant="default" />
            <SkeletonPrimitive className="h-3 rounded w-1/2" variant="muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Section header skeleton — for SectionHeader component.
 */
export function SectionHeaderSkeleton({ withAction = true, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 mb-4 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-2">
        <SkeletonPrimitive className="h-7 w-7 rounded-lg" variant="brand" />
        <SkeletonPrimitive className="h-6 w-32 rounded" variant="default" />
      </div>
      {withAction && <SkeletonPrimitive className="h-7 w-24 rounded-lg shrink-0" variant="muted" />}
    </div>
  )
}

/**
 * Loading overlay skeleton — full page or container loading state.
 */
export function PageSkeleton({ className = '' }) {
  return (
    <div className={`flex min-h-[60vh] flex-col items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
      <div className="space-y-3 w-full max-w-md">
        <SkeletonPrimitive className="h-6 w-3/4 rounded" variant="default" />
        <SkeletonPrimitive className="h-4 w-1/2 rounded" variant="muted" />
        <SkeletonPrimitive className="h-4 w-3/5 rounded" variant="muted" />
      </div>
    </div>
  )
}

/**
 * Page content grid skeleton — for ArticlesPage, CategoryPage grid layouts.
 * @param {number} count - number of grid items to render (default: 6)
 * @param {string} columns - grid cols class (e.g., 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
 */
export function PageGridSkeleton({ count = 6, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className = '' }) {
  return (
    <div className={`grid ${columns} gap-6 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} withImage={true} withMeta={true} />
      ))}
    </div>
  )
}

/**
 * Article detail page skeleton — for ArticleDetails page loading state.
 */
export function ArticlePageSkeleton({ className = '' }) {
  return (
    <div className={`mx-auto max-w-4xl space-y-8 py-8 ${className}`} aria-hidden="true">
      <SkeletonPrimitive className="h-8 w-3/4 rounded" variant="default" />
      <SkeletonPrimitive className="h-4 w-1/2 rounded" variant="muted" />
      <SkeletonPrimitive className="h-4 w-2/3 rounded" variant="muted" />
      <SkeletonPrimitive className="h-4 w-5/6 rounded" variant="muted" />
      <div className="aspect-[16/9] w-full rounded-3xl bg-subtle/60 animate-pulse" />
    </div>
  )
}

/**
 * Ad placeholder skeleton — reserves space for AdSense units to prevent CLS.
 * @param {string} size - 'horizontal' | 'sidebar' | 'infeed' | 'inarticle'
 */
export function AdSkeleton({ size = 'horizontal', className = '' }) {
  const sizeMap = {
    horizontal: 'min-h-[90px] w-full',
    sidebar: 'min-h-[250px] w-full',
    infeed: 'min-h-[100px] w-full',
    inarticle: 'min-h-[120px] w-full',
  }

  return (
    <div
      className={`ad-banner-wrapper rounded-xl border border-hairline bg-surface/50 ${sizeMap[size]} ${className}`}
      data-ad-status="loading"
      aria-hidden="true"
    >
      <div className="text-[10px] font-medium text-ink-faint uppercase tracking-wider mb-1 px-1">
        Advertisement
      </div>
      <SkeletonPrimitive className="w-full h-full" variant="surface" animation="wave" />
    </div>
  )
}

// Export all as a namespace for convenient importing
export const Skeleton = {
  Text: TextSkeleton,
  Card: CardSkeleton,
  Table: TableSkeleton,
  TableRow: TableRowSkeleton,
  ListItem: ListItemSkeleton,
  Hero: HeroSkeleton,
  Article: ArticleSkeleton,
  SidebarWidget: SidebarWidgetSkeleton,
  FormField: FormFieldSkeleton,
  Chip: ChipSkeleton,
  StatsRow: StatsRowSkeleton,
  SectionHeader: SectionHeaderSkeleton,
  Page: PageSkeleton,
  PageGrid: PageGridSkeleton,
  ArticlePage: ArticlePageSkeleton,
  Ad: AdSkeleton,
  Primitive: SkeletonPrimitive,
}

export default Skeleton