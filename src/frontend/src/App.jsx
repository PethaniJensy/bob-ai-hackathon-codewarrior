import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import FleetPage from './pages/FleetPage'
import ColdChainPage from './pages/ColdChainPage'
import DisruptionsPage from './pages/DisruptionsPage'
import AIRecommendationsPage from './pages/AIRecommendationsPage'
import OperationsPage from './pages/OperationsPage'
import ActivityLogPage from './pages/ActivityLogPage'
import SettingsPage from './pages/SettingsPage'
import { ToastProvider } from './components/common/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="shipments" element={<ShipmentsPage />} />
            <Route path="fleet" element={<FleetPage />} />
            <Route path="cold-chain" element={<ColdChainPage />} />
            <Route path="disruptions" element={<DisruptionsPage />} />
            <Route path="ai-recommendations" element={<AIRecommendationsPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="activity-log" element={<ActivityLogPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
