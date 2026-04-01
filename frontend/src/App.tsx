import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { SubscriptionPage } from './pages/SubscriptionPage'

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/plans" element={<SubscriptionPage />} />
      </Routes>
    </div>
  )
}

export default App