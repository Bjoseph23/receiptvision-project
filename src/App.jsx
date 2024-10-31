import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  // Define the paths where NavBar should not be displayed
  const hideNavBarPaths = ['/login','/Login','/Signup', '/signup'];
  
  const isNavBarVisible = !hideNavBarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden m-0 p-0">
      {/* Conditionally render NavBar */}
      {isNavBarVisible && <NavBar />}

      {/* Main Content Area */}
      <div className="flex-1 h-full m-0 p-0 overflow-y-auto">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
