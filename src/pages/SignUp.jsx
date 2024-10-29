import React, { useState } from 'react';
import { TextField, Checkbox, IconButton, InputAdornment, Typography, Link, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    const handleTogglePassword = () => setShowPassword(!showPassword);
    const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(zxcvbn(newPassword).score);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            navigate('/home');
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full overflow-auto">
            {/* Left Section (Image and Welcome Text) */}
            <div className="relative md:w-1/2 w-full h-auto md:h-full flex items-center justify-center bg-gray-100">
                {/* Text Overlay */}
                <div className="absolute top-8 left-8 md:left-12 md:top-12">
                    <div className="flex items-center space-x-2 mb-4 md:mb-8">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome to <span className="text-blue-600">ReceiptVision</span>
                        </h1>
                    </div>
                </div>
                {/* Background Image */}
                <img 
                    src="./assets/signup-image" 
                    alt="Person using laptop and calculator" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = "https://placehold.co/720x1040?text=Signup+Image"; }}
                />
            </div>

            {/* Right Section (Form) */}
            <div className="md:w-1/2 w-full h-full flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>

                    {/* Name Field */}
                    <TextField label="Name" fullWidth variant="outlined" required />

                    {/* Email Field */}
                    <TextField label="Email address" type="email" fullWidth variant="outlined" required />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        required
                        value={password}
                        onChange={handlePasswordChange}
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
                    {/* Password Strength Bar */}
                    <div className="w-full h-2 bg-gray-300 rounded">
                        <div
                            className={`h-full rounded ${passwordStrength === 0
                                    ? 'bg-red-500'
                                    : passwordStrength === 1
                                        ? 'bg-orange-500'
                                        : passwordStrength === 2
                                            ? 'bg-yellow-500'
                                            : passwordStrength === 3
                                                ? 'bg-green-400'
                                                : 'bg-green-600'
                                }`}
                            style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        ></div>
                    </div>

                    {/* Confirm Password Field */}
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Terms of Use and Privacy Policy */}
                    <Typography variant="body2" className="text-gray-600 text-center">
                        By creating an account, you agree to our{' '}
                        <Link href="#" color="primary" underline="hover">
                            Terms of use
                        </Link>{' '}
                        and{' '}
                        <Link href="#" color="primary" underline="hover">
                            Privacy Policy
                        </Link>.
                    </Typography>

                    {/* Simulated reCAPTCHA */}
                    <Box className="border border-gray-300 rounded-lg p-4 flex items-center">
                        <Checkbox color="primary" required />
                        <span className="text-gray-600">I'm not a robot</span>
                        <Box className="ml-auto">
                            <img src="https://placehold.co/70x70?text=reCAPTCHA" alt="reCAPTCHA logo" />
                        </Box>
                    </Box>

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

                    {/* Login Link */}
                    <Typography variant="body2" className="text-center text-gray-600 mt-4">
                        Already have an account?{' '}
                        <Link href="#" color="primary" underline="hover" onClick={() => navigate('/login')}>
                            Log in
                        </Link>
                    </Typography>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
