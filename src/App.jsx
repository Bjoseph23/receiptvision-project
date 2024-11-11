import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './pages/Analytics';
import TermsAndPolicy from './components/TermsAndPolicy';
import OneTapComponent from './components/OneTapComponent';
import NotFoundPage from './pages/NotFoundPage';

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
    const [isNavBarVisible, setIsNavBarVisible] = useState(true);

    // Paths where NavBar should be hidden
    const hideNavBarPaths = ['/login', '/Login','/forgot-password', '/signup', '/Signup'];

    // Update NavBar visibility based on current path
    useEffect(() => {
        // Check if the current path is in the hideNavBarPaths array or is an unmatched route (404)
        if (hideNavBarPaths.includes(location.pathname) || location.pathname === '/404') {
            setIsNavBarVisible(false);
        } else {
            setIsNavBarVisible(true);
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden m-0 p-0">
            {isNavBarVisible && <NavBar />}
            <div className="flex-1 h-full m-0 p-0 overflow-y-auto">
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
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <Analytics />
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
                    <Route
                        path="/expenditure"
                        element={
                            <ProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/goals"
                        element={
                            <ProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
