// import { Toaster } from 'react-hot-toast'
// import './App.css'
// import { SubscriptionPage } from './pages/SubscriptionPage'

// function App() {
//   return (    
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <Toaster position="top-center" reverseOrder={false} />
//       <SubscriptionPage />
//     </div>
//   )
// }

// export default App
import { Toaster } from 'react-hot-toast'
import './App.css'
import { SubscriptionPage } from './pages/SubscriptionPage'

function App() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <SubscriptionPage />
    </div>
  )
}

export default App

