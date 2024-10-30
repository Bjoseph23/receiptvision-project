import React, { useState } from 'react';
import { TextField, Button, IconButton, Typography, Link, Divider, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleTogglePassword = () => setShowPassword(!showPassword);

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
                <form className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Receipt<span className="text-blue-600">Vision</span></h2>
                    <Typography variant="h5" className="text-center text-gray-600 mt-2 mb-4">
                        Sign in
                    </Typography>

                    {/* Google Sign In Button */}
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<img src="https://placehold.co/20x20?text=G" alt="Google icon" />}
                        className="text-gray-600 border-gray-300"
                    >
                        Continue with Google
                    </Button>

                    {/* Divider */}
                    <Divider className="my-4">OR</Divider>

                    {/* Email Field */}
                    <TextField label="Email Address" fullWidth variant="outlined" required />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
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
                        <Link href="#" color="primary" underline="hover">
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Submit Button with Gradient */}
                    <button
                        type="submit"
                        className="w-full rounded-full text-white font-bold text-lg transform transition-transform duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
                            padding: '12px 0',
                            textTransform: 'none',
                        }}
                    >
                        Create account
                    </button>

                    {/* Sign Up Link */}
                    <Typography variant="body2" className="text-center text-gray-600 mt-4">
                        Don’t have an account?{' '}
                        <Link href="#" color="primary" underline="hover" onClick={() => navigate('/signup')}>
                            Sign up
                        </Link>
                    </Typography>
                </form>
            </div>
        </div>
    );
};

export default Login;
