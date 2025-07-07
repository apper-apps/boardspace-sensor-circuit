import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 skeleton"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full skeleton"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full skeleton"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'canvas') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500">Loading canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

export default Loading