// ---------------------------------------------------------------------------
// SarkariFynx — API service layer
// ---------------------------------------------------------------------------
// During frontend development this returns seed data wrapped in promises so
// components can `await` it exactly as they would a real network call.
//
// To go live, install axios and replace each function body with a request,
// e.g.
//
//   import axios from 'axios'
//   const http = axios.create({ baseURL: import.meta.env.VITE_API_URL })
//   export const getJobs = (params) => http.get('/jobs', { params }).then(r => r.data)
//
// The component-facing signatures below are designed to stay identical.
// ---------------------------------------------------------------------------

import {
  jobs,
  categories,
  recruiters,
  popularCourses,
  nowPlaying,
  recentlyPosted,
  trending,
  kindLabels,
} from '../data/seed.js'

// Simulate network latency so loading states are exercised in development.
const LATENCY = 220
const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY))

// Deep clone so callers can't mutate the shared seed objects.
const clone = (value) =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value))

export const getJobs = () => delay(clone(jobs))

export const getJobById = (id) => delay(clone(jobs.find((j) => j.id === id) || null))

export const getJobsByCategory = (slug) =>
  delay(clone(jobs.filter((j) => j.category === slug)))

export const getJobsByKind = (kind) =>
  delay(clone(jobs.filter((j) => j.kind === kind)))

export const getCategories = () => delay(clone(categories))

export const getRecruiters = () => delay(clone(recruiters))

export const getPopularCourses = () => delay(clone(popularCourses))

export const getNowPlaying = () => delay(clone(nowPlaying))

export const getRecentlyPosted = () => delay(clone(recentlyPosted))

export const getTrending = () => delay(clone(trending))

export const getKindLabel = (kind) => kindLabels[kind] || 'Posts'

// Free-text search across title / organisation / category.
export const searchJobs = (query) => {
  const q = (query || '').trim().toLowerCase()
  if (!q) return delay([])
  const matches = jobs.filter((j) =>
    [j.title, j.org, j.orgShort, j.category, j.tagline]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  )
  return delay(clone(matches))
}

// Admin demo: pretend to persist a new/edited post.
export const saveJob = (payload) => {
  // In production this would POST/PUT to the server.
  return delay({ ok: true, id: payload.id || 'new-post', savedAt: new Date().toISOString() })
}

// ---------------------------------------------------------------------------
// Real HTTP API — used by Admin pages for authenticated operations.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function http(method, path, { token, body, params } = {}) {
  const url = new URL(`${API_BASE}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // 204 No Content (delete)
  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// --- Auth ---
export const loginAdmin = (email, password) =>
  http('POST', '/api/auth/login', { body: { email, password } })

export const registerUser = (name, email, password) =>
  http('POST', '/api/auth/register', { body: { name, email, password } })

export const googleAuth = (credential) =>
  http('POST', '/api/auth/google', { body: { credential } })

export const getMe = (token) =>
  http('GET', '/api/auth/me', { token })

// --- Admin CRUD ---
export const createJob = (token, payload) =>
  http('POST', '/api/jobs', { token, body: payload })

export const updateJob = (token, id, payload) =>
  http('PUT', `/api/jobs/${encodeURIComponent(id)}`, { token, body: payload })

export const deleteJob = (token, id) =>
  http('DELETE', `/api/jobs/${encodeURIComponent(id)}`, { token })

// --- Admin Reads (from real API) ---
export const fetchJobs = (params) =>
  http('GET', '/api/jobs', { params })

export const fetchJobStats = () =>
  http('GET', '/api/jobs/stats')

export const fetchJobById = (id) =>
  http('GET', `/api/jobs/${encodeURIComponent(id)}`)

export const fetchDashboard = (token) =>
  http('GET', '/api/admin/dashboard', { token })

// --- Feedback & Suggestions ---
export const submitFeedback = (payload) =>
  http('POST', '/api/feedback', { body: payload })

export const fetchFeedbacks = (token, params) =>
  http('GET', '/api/feedback', { token, params })

export const updateFeedbackStatus = (token, id, status) =>
  http('PATCH', `/api/feedback/${encodeURIComponent(id)}/status`, { token, body: { status } })

export const deleteFeedback = (token, id) =>
  http('DELETE', `/api/feedback/${encodeURIComponent(id)}`, { token })

export const fetchFeedbackStats = (token) =>
  http('GET', '/api/feedback/stats', { token })

export default {
  getJobs,
  getJobById,
  getJobsByCategory,
  getJobsByKind,
  getCategories,
  getRecruiters,
  getPopularCourses,
  getNowPlaying,
  getRecentlyPosted,
  getTrending,
  getKindLabel,
  searchJobs,
  saveJob,
  loginAdmin,
  registerUser,
  googleAuth,
  getMe,
  createJob,
  updateJob,
  deleteJob,
  fetchJobs,
  fetchJobStats,
  fetchJobById,
  fetchDashboard,
  submitFeedback,
  fetchFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  fetchFeedbackStats,
}

