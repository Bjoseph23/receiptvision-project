import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Expenditure from './pages/Expenditure'; // Updated import
import TermsAndPolicy from './components/TermsAndPolicy'; 
import OneTapComponent from './components/OneTapComponent'; // Fixed path

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideNavBarPaths = ['/login', '/Login', '/signup', '/Signup'];
    const isNavBarVisible = !hideNavBarPaths.includes(location.pathname);
    
    return (
        <div className="flex h-screen overflow-hidden m-0 p-0">
            {isNavBarVisible && <NavBar />}
            <div className="flex-1 h-full m-0 p-0 overflow-y-auto">
                {/* Google One-Tap Component: Loads conditionally */}
                <OneTapComponent />
                
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/expenditure"
                        element={
                            <ProtectedRoute>
                                <Expenditure />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/terms"
                        element={
                            <ProtectedRoute>
                                <TermsAndPolicy />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
