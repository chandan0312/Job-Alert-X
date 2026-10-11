// ---------------------------------------------------------------------------
// Article Model — for Job Guides, How to Apply, How to Download, Strategy, etc.
// ---------------------------------------------------------------------------

import { DataTypes } from 'sequelize'

export const ARTICLE_CATEGORIES = [
  'job-guide',
  'how-to-apply',
  'how-to-download',
  'strategy',
  'syllabus',
  'result',
  'documentation',
  'general',
]

export const ARTICLE_CATEGORY_LABELS = {
  'job-guide': 'Job & Career Guides',
  'how-to-apply': 'How to Apply',
  'how-to-download': 'How to Download',
  strategy: 'Exam Strategy & Tips',
  syllabus: 'Syllabus Breakdown',
  result: 'Results & Cut-off',
  documentation: 'Document Verification',
  general: 'General Advice',
}

export default function defineArticle(sequelize) {
  return sequelize.define(
    'Article',
    {
      id: {
        type: DataTypes.STRING(160),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: 'Article title is required' } },
      },
      slug: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: 'Article slug is required' } },
      },
      category: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'job-guide',
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: '',
      },
      coverImage: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Job Alert X Team',
      },
      authorRole: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Recruitment & Career Expert',
      },
      readTime: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '5 min read',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'published',
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      metaTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'articles',
      timestamps: true,
      indexes: [
        { unique: true, fields: ['slug'] },
        { fields: ['category'] },
        { fields: ['status'] },
        { fields: ['featured'] },
        { fields: ['createdAt'] },
      ],
    }
  )
}
