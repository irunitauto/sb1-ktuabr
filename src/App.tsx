import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Settings, Facebook, FileSpreadsheet, Clock, Shield, FileText } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './components/Dashboard';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import 'react-toastify/dist/ReactToastify.css';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center space-x-2">
                    <Settings className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl">Social Post Manager</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
                  <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>

          <ToastContainer position="bottom-right" />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;