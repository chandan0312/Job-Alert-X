# Master Website Prerequisites & Technical Architecture Blueprint
> **Production Engineering Guide for High-Traffic Recruitment & Examination Portals**
> *Based on the battle-tested architecture of Jharkhand JobAlert X*

---

## 1. Technology Stack & Runtime Environment

### 1.1 Frontend Architecture
* **Framework**: React 18 / 19 with Vite (ES Modules, instant HMR, tree-shaking).
* **Styling**: Tailwind CSS (with CSS Custom Property token extensions) + Vanilla CSS reset.
* **Routing**: React Router DOM (v6 / v7) with code-splitting (`React.lazy` and `Suspense`).
* **Icons**: `lucide-react` (SVG-based, tree-shakable, 1.8px default stroke).
* **SEO & Metadata**: Dynamic OpenGraph, Twitter Cards, canonical links, and Schema.org JSON-LD via unified `SEOHead` component.

### 1.2 Backend Architecture
* **Runtime**: Node.js (LTS version >= 18.x).
* **Framework**: Express.js (REST API, compression, CORS whitelisting).
* **ORM & Database Client**: Sequelize v6 with `mysql2` (Connection pooling: max 10, min 0, acquire 30,000ms).
* **Database Engine**: MySQL 8.0+ / MariaDB 10.5+ with `utf8mb4` character set (supports ₹ symbols, em-dashes, Hindi/regional scripts). SQLite3 supported for local development.
* **Security & Auth**: `bcryptjs` (password hashing), `jsonwebtoken` (JWT signed sessions, 7d expiry), Google Identity Services OAuth 2.0.

---

## 2. Multi-Tier Performance & Zero-Lag Caching Architecture

To guarantee zero lag under high traffic spikes (result releases, admit card drops), the application implements a 3-tier caching and deduplication pipeline:

```
[User Browser]
      │
      ├── Tier 1: In-Memory Map (0ms instant response)
      │
      ├── Tier 2: SessionStorage (Persists across reloads & back/forward navigation)
      │
      ├── Request Deduplication: In-Flight Map (Coalesces simultaneous calls)
      │
      ▼
[Express Server API]
      │
      ├── Tier 3: Memory Cache Middleware (30s–60s TTL)
      │
      ▼
[MySQL Database]
```

### 2.1 Client Service Layer (`services/api.js`)
```javascript
const memoryCache = new Map();
const inFlightRequests = new Map();

export async function http(method, path, { token, body, params, ttl = 60000, bypassCache = false } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  const cacheKey = `${method}:${url.pathname}?${url.searchParams.toString()}${token ? `:${token}` : ''}`;

  if (method !== 'GET') {
    clearApiCache(); // Invalidate on admin mutations
  }

  if (method === 'GET' && !bypassCache) {
    // 1. Tier 1: Memory Cache
    const mem = memoryCache.get(cacheKey);
    if (mem && Date.now() - mem.timestamp < mem.ttl) return mem.data;

    // 2. Tier 2: SessionStorage
    try {
      const sess = JSON.parse(sessionStorage.getItem(`jax_cache_${cacheKey}`));
      if (sess && Date.now() - sess.timestamp < sess.ttl) {
        memoryCache.set(cacheKey, sess);
        return sess.data;
      }
    } catch (_) {}

    // 3. In-flight Deduplication
    if (inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey);
  }

  const execute = async () => {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (method === 'GET') {
      const item = { data, timestamp: Date.now(), ttl };
      memoryCache.set(cacheKey, item);
      try { sessionStorage.setItem(`jax_cache_${cacheKey}`, JSON.stringify(item)); } catch (_) {}
    }
    return data;
  };

  const req = execute().finally(() => inFlightRequests.delete(cacheKey));
  if (method === 'GET' && !bypassCache) inFlightRequests.set(cacheKey, req);
  return req;
}
```

---

## 3. Database Schema & Data Models

### 3.1 `jobs` Table (Primary Recruitment Notifications)
| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | VARCHAR(120) | PRIMARY KEY | Unique slug/ID (e.g., `jpsc-civil-services-2026`) |
| `title` | VARCHAR(500) | NOT NULL | Official post headline |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | SEO URL slug |
| `org` | VARCHAR(255) | NOT NULL | Hiring department / commission |
| `orgShort` | VARCHAR(80) | NULL | Short acronym (e.g., `JPSC`, `JSSC`) |
| `category` | VARCHAR(100) | INDEX, NOT NULL | Category slug (`jpsc`, `jssc`, `rojgar-mela`, etc.) |
| `kind` | ENUM | NOT NULL | `job`, `admit-card`, `result`, `answer-key`, `syllabus` |
| `vacancies` | INT | DEFAULT 0 | Total number of vacancies |
| `salary` | VARCHAR(500) | NULL | Pay scale / Grade pay text |
| `postedOn` | VARCHAR(120) | NULL | Human date string (e.g., `24 Aug 2026`) |
| `importantDates`| JSON | NULL | Array of `{ label, value }` |
| `fee` | JSON | NULL | Array of `{ label, value }` by category |
| `posts` | JSON | NULL | Array of `{ name, total, eligibility }` |
| `links` | JSON | NULL | Array of `{ label, href, primary }` |
| `full_description`| LONGTEXT | NULL | Sanitized HTML content / exam details |
| `featured` | BOOLEAN | DEFAULT FALSE | Display in Home Page Carousel |
| `inTicker` | BOOLEAN | DEFAULT FALSE | Display in Header Live Ticker |
| `views` | INT | DEFAULT 0 | Historical hit counter (backend analytics only) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last revision (for E-E-A-T timestamps) |

### 3.2 `articles` Table (Career Guides & Walkthroughs)
| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | VARCHAR(120) | PRIMARY KEY | Unique ID |
| `title` | VARCHAR(500) | NOT NULL | Article title |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| `category` | VARCHAR(80) | NOT NULL | `exam_strategy`, `how_to_apply`, `admit_card_guide`, etc. |
| `content` | LONGTEXT | NOT NULL | Markdown / Rich HTML guide content |
| `coverImage` | VARCHAR(1000) | NULL | Featured article cover image URL |
| `readTime` | VARCHAR(40) | DEFAULT '5 min read' | Estimated reading time |
| `status` | ENUM | DEFAULT 'published' | `published` or `draft` |
| `featured` | BOOLEAN | DEFAULT FALSE | Hero spotlight flag |

---

## 4. State & Theme Management Rules

### 4.1 Zero-Flash Theme Switching (`ThemeContext.jsx`)
- Initial theme must be read synchronously from `window.localStorage` and inline HTML attributes before React mounts.
- Set `data-theme="dark"` and toggle `.dark` on `document.documentElement`.
- **Anti-Pattern Warning**: NEVER trigger state updates (`setState`) inside render callbacks or during component evaluation (e.g., inside `NavLink` render functions). Always position indicators and recalculate offsets inside `useEffect` keyed on `location.pathname`.

### 4.2 Sidebar Collapsed State Persistence
- Toggle state stored in `localStorage.getItem('sidebar_collapsed')`.
- Global desktop CSS layout listens to CSS variable `--sidebar-width: 260px` or `72px`.

---

## 5. SEO, Structured Data & E-E-A-T Standards

### 5.1 JSON-LD Structured Data Implementation
Every page automatically injects schema markup via `<SEOHead>`:
1. **Homepage**:
   - `WebSite` Schema with `SearchAction` deep linking into `/search?q={search_term}`.
   - `Organization` Schema with official logo, contacts, and state coverage.
2. **Job Details Page**:
   - `JobPosting` Schema with `title`, `datePosted`, `validThrough`, `hiringOrganization`, `jobLocation`, `baseSalary`, and `employmentType`.
   - `BreadcrumbList` Schema showing Home > Category > Job Title.
3. **Article Pages**:
   - `Article` / `NewsArticle` Schema with author credentials, datePublished, and dateModified.

### 5.2 Canonical URLs & Indexing Rules
- Self-referencing canonical URLs on all public job and category routes.
- Force `noIndex={true}` on all Search result pages, Login/Signup routes, and Admin control panel paths.

---

## 6. Security & Infrastructure Hardening

1. **Authentication**:
   - JWT tokens signed with strong 256-bit secret.
   - Passwords salted and hashed with `bcryptjs` (cost factor >= 10).
   - Rate limiting on `/api/auth/*` (maximum 10 attempts per IP per 15 minutes).
2. **CORS Whitelisting**:
   - Explicit allowed origins array configured in `.env` (`http://localhost:5173`, production domain).
3. **Keep-Alive & Connection Draining**:
   - Set server keep-alive timeout to 65s (exceeds proxy / load balancer 60s timeout to avoid 502 Bad Gateway errors).
   - Implement graceful shutdown on `SIGTERM` / `SIGINT` to allow in-flight MySQL transactions to finish cleanly.

---

## 7. Environment Configuration Reference

### 7.1 Backend Environment (`backend/.env`)
```ini
PORT=5000
NODE_ENV=production

# Database Configuration (MySQL / MariaDB)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=jobalert_db
DB_USER=jobalert_user
DB_PASSWORD=SecurePassword123#
DB_LOGGING=false

# Security & Sessions
JWT_SECRET=production_random_secret_hash_key_64char
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=https://yourportal.com,http://localhost:5173
```

### 7.2 Frontend Environment (`frontend/.env`)
```ini
VITE_API_URL=https://api.yourportal.com
VITE_SITE_URL=https://yourportal.com
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com
```

---

## 8. Development & Production Deployment Runbook

### Local Development
```bash
# 1. Start MySQL and import seed schema
# 2. Start Backend API
cd backend
npm install
npm run dev # Runs nodemon on http://localhost:5000

# 3. Start Frontend Client
cd ../frontend
npm install
npm run dev -- --port 5173 # Runs Vite on http://localhost:5173
```

### Production Build & Verification
```bash
# Frontend production bundle
cd frontend
npm run build # Emits optimized static assets to /dist

# Verify output:
# ✓ 1631 modules transformed
# ✓ Zero syntax / bundling errors
# ✓ Production assets ready for Nginx / CDN hosting
```
