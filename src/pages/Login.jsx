import React, { useState } from 'react';
import { TextField, Button, IconButton, Typography, Link, Divider } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const navigate = useNavigate();

    const handleTogglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.email || !formData.password) {
                throw new Error('Please fill in all fields');
            }

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) {
                // Handle specific error cases
                switch (signInError.message) {
                    case 'Invalid login credentials':
                        throw new Error('Invalid email or password');
                    case 'Email not confirmed':
                        throw new Error('Please verify your email address');
                    default:
                        throw new Error(signInError.message);
                }
            }

            if (data?.user) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) throw error;
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message);
        }
    };

    // Function to create a test account (temporary, remove in production)
    const handleCreateTestAccount = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            alert('Test account created! Please check your email for verification.');
        } catch (err) {
            console.error('Sign up error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Left Section (Image and Welcome Text) */}
            <div className="md:w-1/2 w-full h-1/2 md:h-full flex flex-col items-center justify-center bg-gray-100 p-6 relative">
                <div className="absolute inset-0">
                    <img
                        src="/assets/login-image.png"
                        alt="Person holding laptop"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://placehold.co/720x1040?text=Login+Image"; }}
                    />
                </div>
                <div className="relative z-10 text-left p-8 bg-opacity-75">
                    <div className="flex items-center space-x-2 mb-4 md:mb-8">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <h1 className="text-3xl font-bold text-white">
                            Snap, Scan, Simplify!
                        </h1>
                    </div>
                    <p className="text-white text-lg">
                        Track your spending and re-imagine budgeting. Powered by AI.
                    </p>
                </div>
            </div>

            {/* Right Section (Login Form) */}
            <div className="md:w-1/2 w-full h-full flex items-center justify-center p-8">
                <form className="w-full max-w-md space-y-6" onSubmit={handleEmailLogin}>
                    <h2 className="text-3xl font-bold text-center text-gray-800">Receipt<span className="text-blue-600">Vision</span></h2>
                    <Typography variant="h5" className="text-center text-gray-600 mt-2 mb-4">
                        Sign in
                    </Typography>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoogleLogin}
                        startIcon={<img src="https://placehold.co/20x20?text=G" alt="Google icon" />}
                        className="text-gray-600 border-gray-300"
                    >
                        Continue with Google
                    </Button>

                    <Divider className="my-4">OR</Divider>

                    {/* Email Field */}
                    <TextField 
                        label="Email Address" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth 
                        variant="outlined" 
                        required 
                    />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link href="/forgot-password" color="primary" underline="hover">
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Submit Button with Gradient */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full text-white font-bold text-lg transform transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
                            padding: '12px 0',
                            textTransform: 'none',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    {/* Temporary: Create Test Account Button */}
                    <button
                        type="button"
                        onClick={handleCreateTestAccount}
                        className="w-full mt-2 p-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Create Test Account
                    </button>

                    {/* Sign Up Link */}
                    <Typography variant="body2" className="text-center text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link href="/signup" color="primary" underline="hover">
                            Sign up
                        </Link>
                    </Typography>
                </form>
            </div>
        </div>
    );
};

export default Login;