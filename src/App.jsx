import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customer from './pages/Customer'
import Kiosk from './pages/Kiosk'
import Pricing from './pages/Pricing'
import Ads from './pages/Ads'
import Transaksi from './pages/Transaksi'
import AkunAdmin from './pages/AkunAdmin'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, token } = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  // Check if user has valid token and is authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore()
  
  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <div data-theme="blackboxz">
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customer" element={<Customer />} />
            <Route path="setup/kiosk" element={<Kiosk />} />
            <Route path="setup/pricing" element={<Pricing />} />
            <Route path="setup/ads" element={<Ads />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="akun-admin" element={<AkunAdmin />} />
          </Route>
        </Routes>
      </Router>
      
      {/* React Hot Toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App
