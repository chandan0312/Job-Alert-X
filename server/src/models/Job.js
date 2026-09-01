// ---------------------------------------------------------------------------
// Job — the core dataset (jobs, admit cards, results, answer keys, syllabus).
// ---------------------------------------------------------------------------
// Column strategy: scalar columns for everything the API filters, searches or
// sorts on; JSON columns for the nested, display-only structures
// (importantDates / fee / posts / links / ageLimit / logo).
//
// This keeps every response shape-identical to the frontend's seed objects in
// `client/src/data/seed.js` with no joins or reassembly, which is what makes
// swapping `client/src/services/api.js` for real HTTP a drop-in change.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

/** `kind` drives which category page a post appears on. */
export const JOB_KINDS = ['job', 'admit-card', 'result', 'answer-key', 'syllabus']

export default function defineJob(sequelize) {
  return sequelize.define(
    'Job',
    {
      // The human-readable slug from the frontend (e.g. "ssc-cgl-2024") is the
      // primary key — the UI routes on it (/job/:id), so there is no separate
      // surrogate id to leak into responses.
      id: {
        type: DataTypes.STRING(120),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'title is required' } },
      },
      org: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'org is required' } },
      },
      orgShort: DataTypes.STRING(60),
      category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'ssc',
      },
      kind: {
        type: DataTypes.ENUM(...JOB_KINDS),
        allowNull: false,
        defaultValue: 'job',
      },
      tagline: DataTypes.STRING(255),
      shortInfo: DataTypes.TEXT,
      eligibility: DataTypes.TEXT,
      // Short label for card/list views (≤ 28 chars), e.g. "B.Tech / B.E", "Any Graduate".
      // Full eligibility text is in `eligibility` above — shown only on the detail page.
      eligibilityShort: DataTypes.STRING(80),

      // Display strings, kept verbatim from the source notification rather than
      // derived from timestamps ("3 hours ago", "23 Aug 2026").
      postedAt: DataTypes.STRING(60),
      postedOn: DataTypes.STRING(60),

      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      applications: DataTypes.INTEGER,
      vacancies: DataTypes.INTEGER,

      // Featured posts feed the home-page hero carousel ("Trending This Week").
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      // inTicker posts feed the moving header marquee ticker ("Live Announcements").
      inTicker: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      // --- JSON (display-only) ---
      logo: DataTypes.JSON, //           { icon, color }
      importantDates: DataTypes.JSON, // [{ label, value }]
      fee: DataTypes.JSON, //            [{ label, value }]
      ageLimit: DataTypes.JSON, //       { min, max, note }
      posts: DataTypes.JSON, //          [{ name, total, eligibility }]
      links: DataTypes.JSON, //          [{ label, href, primary? }]
    },
    {
      tableName: 'jobs',
      timestamps: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['kind'] },
        { fields: ['featured'] },
        { fields: ['createdAt'] },
      ],
    }
  )
}
