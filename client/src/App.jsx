import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Public Pages
import Home from './pages/Home.jsx'
import JobDetails from './pages/JobDetails.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ExamsPage from './pages/ExamsPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import FeedbackPage from './pages/FeedbackPage.jsx'
import Placeholder from './pages/Placeholder.jsx'

// Admin Pages
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminPosts from './pages/AdminPosts.jsx'
import AdminPostForm from './pages/AdminPostForm.jsx'
import AdminFeedback from './pages/AdminFeedback.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes (Dedicated Admin Layout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<AdminPostForm />} />
            <Route path="posts/:id" element={<AdminPostForm />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>

          {/* Main User Portal Routes */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="latest/:kind" element={<CategoryPage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="search" element={<SearchPage />} />

            {/* Feedback & suggestions — replaces the old notifications screen */}
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="notifications" element={<Navigate to="/feedback" replace />} />

            {/* User secondary destinations */}
            <Route path="recent" element={<Placeholder />} />
            <Route path="bookmarked" element={<Placeholder />} />
            <Route path="saved" element={<Placeholder />} />
            <Route path="profile" element={<Placeholder />} />
            <Route path="settings" element={<Placeholder />} />
            <Route path="logout" element={<Placeholder />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<Placeholder />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
