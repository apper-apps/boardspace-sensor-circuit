import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  
  const isDashboardView = location.pathname.includes('/dashboard/') && location.pathname.includes('/view')
  const isCanvasEditor = location.pathname.includes('/dashboard/') && !location.pathname.includes('/view')
  
  const showSidebar = !isDashboardView && !isCanvasEditor

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        showMenuButton={showSidebar}
      />
      
      <div className="flex">
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <Sidebar />
            </div>
            
            {/* Mobile Sidebar */}
            <div className={`
              lg:hidden fixed inset-0 z-50 
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              transition-transform duration-300 ease-in-out
            `}>
              <div className="flex">
                <div className="w-64 bg-white h-full">
                  <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>
                <div 
                  className="flex-1 bg-black bg-opacity-50" 
                  onClick={() => setIsSidebarOpen(false)}
                />
              </div>
            </div>
          </>
        )}
        
        <main className={`
          flex-1 
          ${showSidebar ? 'lg:ml-0' : ''}
          ${isCanvasEditor ? 'pt-0' : 'pt-16'}
        `}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout