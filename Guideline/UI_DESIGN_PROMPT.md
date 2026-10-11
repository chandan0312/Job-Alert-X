# Master UI/UX Design Prompt & Design System Specification
> **For Government Recruitment, Examination Portals & Career Directory Platforms**
> *Based on the production architecture and design system of Jharkhand JobAlert X*

---

## 1. System Vision & Aesthetic Philosophy
You are an expert Principal UI/UX Designer and Frontend Architect. Your objective is to design and build an authoritative, high-density, ultra-responsive government recruitment and career portal that blends **government credibility and trustworthiness** with **modern, lightning-fast SaaS design aesthetics**.

### Core Tenets:
1. **High Information Density with Zero Clutter**: Aspirants and job-seekers need immediate access to deadlines, eligibility, vacancies, and application links without wading through bulky hero banners or slow vanity widgets.
2. **Deterministic Design Token Architecture**: 100% of colors, surfaces, borders, and typography must be driven by semantic CSS custom properties (`--bg`, `--surface`, `--border`, `--text`, `--accent`). No ad-hoc hardcoded hex values or brittle multi-class overrides.
3. **Flawless Light & Dark Themes**: Theme switching must be instant (0ms lag, no flash of unstyled content, no infinite render loops) with high contrast compliance (WCAG AAA).
4. **Independent Scrolling & Dual-Rail Layouts**: Top navigation, collapsible side navigation, central feed, and right sidebar widgets must have designated scrolling boundaries to prevent layout trapping or hidden content.

---

## 2. Design Tokens & Color System

### 2.1 Semantic Custom Properties (`index.css`)
```css
@layer base {
  :root {
    color-scheme: light;

    /* Surfaces */
    --bg:            #eef4fc;
    --surface:       #ffffff;
    --surface-2:     #f3f7fd;
    --header-bg:     #ffffff;

    /* Borders */
    --border:        #dbe4f0;
    --border-strong: #c3d0e2;

    /* Text */
    --text:          #0b1d36;
    --text-2:        #44536b;
    --text-muted:    #637189;

    /* Accent & Interactions */
    --accent:        #0066f5;
    --accent-hover:  #0052c7;
    --accent-soft:   rgba(0, 102, 245, 0.08);
    --accent-strong: rgba(0, 102, 245, 0.16);
    --on-accent:     #ffffff;

    /* Focus Rings & Shadows */
    --focus-ring:    0 0 0 3px rgba(0, 102, 245, 0.18);
    --shadow-sm:     0 1px 2px rgba(16, 24, 40, 0.05);
    --shadow-md:     0 4px 12px rgba(16, 24, 40, 0.08);
    --shadow-lg:     0 12px 32px rgba(16, 24, 40, 0.14);
    --overlay:       rgba(7, 29, 73, 0.35);

    /* Status & Alerts */
    --success:       #067647;
    --success-bg:    #ecfdf3;
    --warning:       #b54708;
    --warning-bg:    #fffaeb;
    --danger:        #b42318;
    --danger-bg:     #fef3f2;
    --info:          #175cd3;
    --info-bg:       #eff8ff;

    /* Portal Brand Palette */
    --brand-primary: #1B6F81;
    --brand-dark:    #09324A;
    --brand-gold:    #FFFB08;
    --brand-teal:    #AED0C9;
    --brand-flame:   #f97316;
  }

  [data-theme="dark"] {
    color-scheme: dark;

    /* Surfaces */
    --bg:            #0b1020;
    --surface:       #121a2e;
    --surface-2:     #182232;
    --header-bg:     #0d1426;

    /* Borders */
    --border:        #243042;
    --border-strong: #33415e;

    /* Text */
    --text:          #e8edf5;
    --text-2:        #9bacb4;
    --text-muted:    #8591a8;

    /* Accent */
    --accent:        #00a1ff;
    --accent-hover:  #38b6ff;
    --accent-soft:   rgba(0, 161, 255, 0.12);
    --accent-strong: rgba(0, 161, 255, 0.22);
    --on-accent:     #04122e;

    /* Focus & Shadows */
    --focus-ring:    0 0 0 3px rgba(0, 161, 255, 0.2);
    --shadow-sm:     0 1px 2px rgba(0, 0, 0, 0.35);
    --shadow-md:     0 4px 12px rgba(0, 0, 0, 0.35);
    --shadow-lg:     0 12px 32px rgba(0, 0, 0, 0.35);
    --overlay:       rgba(7, 29, 73, 0.65);

    /* Status & Alerts */
    --success:       #34d399;
    --success-bg:    rgba(52, 211, 153, 0.1);
    --warning:       #fbbf24;
    --warning-bg:    rgba(251, 191, 36, 0.1);
    --danger:        #f87171;
    --danger-bg:     rgba(248, 113, 113, 0.1);
    --info:          #60a5fa;
    --info-bg:       rgba(96, 165, 250, 0.1);
  }
}
```

### 2.2 Tailwind Configuration (`tailwind.config.js`)
Ensure all semantic colors, aliases, and radius scales are mapped to CSS variables:
```javascript
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        text: { DEFAULT: 'var(--text)', 2: 'var(--text-2)', muted: 'var(--text-muted)' },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          strong: 'var(--accent-strong)',
          on: 'var(--on-accent)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          soft: 'var(--text-2)',
          muted: 'var(--text-2)',
          faint: 'var(--text-muted)',
        },
        hairline: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        subtle: 'var(--surface-2)',
        page: 'var(--bg)',
      },
      borderRadius: {
        badge: '6px',
        btn: '8px',
        row: '10px',
        card: '12px',
        panel: '14px',
        dialog: '16px',
        pill: '999px',
      },
    },
  },
};
```

---

## 3. Structural Layout & Navigation Architecture

### 3.1 Global Header (Fixed 64px)
The top navigation bar is fixed at `height: 64px` (`--header-height: 64px`) with 3 distinct zones:
1. **Left Zone**:
   - Universal menu/collapse trigger (`btn-icon`, 36x36px) — toggles desktop rail (260px ↔ 72px) and mobile drawer.
   - Portal Emblem + Wordmark lockup (e.g., `JobAlert X` + State badge `JHARKHAND`).
2. **Center Zone (Live Job Marquee Ticker)**:
   - High-performance, pill-shaped horizontal container (`bg: var(--surface-2)`).
   - Fixed Flame Icon + `"Live Jobs"` status indicator on the left.
   - Smooth CSS marquee ticker displaying active vacancies, department tags, and post counts.
   - Automatically pauses on hover (`hover:[animation-play-state:paused]`).
   - Links directly to job details (`/job/:id`).
3. **Right Zone (Quick Utilities)**:
   - Guides Icon (`BookOpen`) linked directly to `/articles`.
   - Search Shortcut (`Search`) linked to `/search`.
   - Feedback Shortcut (`MessageSquarePlus`) linked to `/feedback`.
   - Instant Theme Toggle (`Sun` / `MoonStar`) without page reload.
   - User Account avatar or `"Sign in"` button.

### 3.2 Dual-State Collapsible Sidebar (`Sidebar.jsx`)
- **Desktop Expanded (260px)**: Displays category icons, labels, section dividers, and notification counts.
- **Desktop Collapsed (72px Icon Rail)**: Icons centered with floating tooltip on hover (`.sidebar-tooltip`).
- **Persistent State**: Persisted in `localStorage.getItem('sidebar_collapsed')`.
- **Dynamic Content Offset**: The main layout listens to sidebar state via CSS:
  ```css
  @media (min-width: 1024px) {
    .layout-transition {
      padding-left: var(--sidebar-width) !important;
    }
  }
  ```

---

## 4. Home Page Feed Architecture

### 4.1 Compact State Identity Banner
- Single-row high-contrast banner replacing traditional hero sections.
- Features:
  - Radiating pulsing live dot (`#FFFB08`).
  - Pre-title: `"Jharkhand's Official Job Portal"`.
  - Main headline: `"Jharkhand JobAlert X — JPSC · JSSC · Rojgar Mela · 2026"`.
  - Trust badge: `"2026 Verified"` pill.
  - Linear gradient background with subtle geometric grid overlay.

### 4.2 "Trending This Week" Banner Carousel (`HeroBanner.jsx`)
- Compact carousel driven by active vacancies with auto-slide timer (5.5s) and pause-on-hover.
- Displays:
  - Urgent Tag: `"Trending"` (orange flame).
  - Category Badge (`JPSC`, `JSSC`, `Central`, `Private`).
  - Job Title and Department with hover accent transition.
  - Vacancy badge and Last Date countdown badge.
  - Fallback logic: If database has 0 featured jobs, automatically falls back to `recentlyPosted` so the carousel is never empty.

### 4.3 Category Browsing Slider (`JobCategoryCards.jsx`)
- Horizontal multi-department card grid: JPSC, JSSC, District Employment Exchanges, Rojgar Mela, Corporate Private, and Central Recruitments.
- Each card has custom themed gradients, quick department acronyms, and instant drilldown navigation.

### 4.4 Tabular Job Sections (`RecentJobsTable.jsx`)
- Dense, tabular rows on desktop (`>= 640px`):
  - Org Icon / Avatar tile.
  - Post Title, Department, and Qualification snippet.
  - Total Vacancies count.
  - Last Date deadline badge with clock icon.
  - Direct `"Details"` and `"Apply"` action buttons.
- Mobile Adaptive Cards (`< 640px`):
  - Seamlessly transforms each row into an elevated card with stacked metadata and full-width touch targets.

---

## 5. Right Sidebar Widgets (`RightSidebar.jsx`)
The right sidebar must be sticky on desktop viewports with **independent smooth scrolling**:
```jsx
<div className="space-y-4 xl:sticky xl:top-[76px] xl:max-h-[calc(100vh-88px)] xl:overflow-y-auto pr-1 pb-6 scrollbar-thin">
  <QuickSearch />
  <AttentionCard />
  <ResultsCard />
  <AdmitCardsCard />
  <AnswerKeysCard />
  <SyllabusCard />
</div>
```

### 5.1 "Attention — Ending Soon" Card (`AttentionCard.jsx`)
- Dedicated urgency widget tracking nearest closing deadlines.
- **Short Job Titles**: Clean 1-line truncation (`truncate text-[12px]`) with full title on hover.
- **Short Date Formats**: Compact badges like `"31 Oct"`, `"29 Sep"`, `"15 Nov"` instead of verbose dates.
- Real-time pulse indicator on the header.

---

## 6. Job Details Page Architecture (`JobDetails.jsx`)
- **Clean Overview**: Post title, department, publication date, total posts, and application fee.
- **Removed Vanity Counters**: No distracting `"Total Views"` or artificial view count badges.
- **Structured Table Modules**:
  - Important Dates Table (Start Date, Closing Date, Exam Date, Admit Card Date).
  - Application Fee Breakdown by Category (UR, OBC, SC, ST, PH).
  - Eligibility & Educational Criteria with bulleted requirements.
  - Vacancy Matrix with post name, category distribution, and pay scales.
  - Official Action Buttons: `"Apply Online (Portal)"`, `"Download Notification (PDF)"`, `"Official Website"`.

---

## 7. Admin Control Panel Experience (`AdminLayout.jsx`)
- Shared 64px header and responsive sidebar navigation.
- Real-time management dashboards for:
  - Posts (instant toggle for `"Trending / Featured"` and `"Live Header Ticker"`).
  - Career Blog / Articles with Markdown & Rich Text editor.
  - Feedback triage and live search query analytics.
- Cohesive design tokens applied across all form controls, modals, and metric stat cards.

---

## 8. Micro-Interactions, Animation & Responsiveness Standards
1. **Zero Layout Shift (CLS = 0)**: Predefined skeletons for tables, carousels, and cards.
2. **Fast Tap Response**: Apply `touch-action: manipulation` across all interactive buttons, tabs, and links.
3. **Smooth Hover Elevation**: Cards subtly translate `-2px` on hover with a smoothed box shadow (`var(--shadow-md)`).
4. **Accessible Focus Rings**: Use `box-shadow: var(--focus-ring)` with 3px accent outline for keyboard navigation.
