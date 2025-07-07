import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import DashboardList from '@/components/pages/DashboardList'
import CanvasEditor from '@/components/pages/CanvasEditor'
import DashboardView from '@/components/pages/DashboardView'
import Layout from '@/components/organisms/Layout'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardList />} />
          <Route path="/dashboard/:id" element={<CanvasEditor />} />
          <Route path="/dashboard/:id/view" element={<DashboardView />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App