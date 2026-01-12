import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './features/auth/components/auth-conatiner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<AuthPage />} />
        {/* כאן אפשר להוסיף Routes נוספים בעתיד */}
      </Routes>
    </Router>
  )
}

export default App
