import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseconfig';

// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import Navbar from "./Navbar";

// --- SVG Icons ---
function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </Box>
  );
}

export default function SignUpPage() {
  const navigate = useNavigate();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  // Local Validation Logic
  function validate() {
    const next = {};

    if (!name.trim()) {
      next.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address';
    }

    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      next.password = 'Password must include uppercase, lowercase, and a number';
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      next.terms = 'You must agree to the terms';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Firebase Form Submission Handler
  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Set display name & store user record in Firestore concurrently
      await Promise.all([
        updateProfile(user, { displayName: name.trim() }),
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name.trim(),
          email: email.trim(),
          createdAt: serverTimestamp(),
        })
      ]);

      // 3. Redirect to products page
      navigate('/products');
    } catch (error) {
      console.error("Register Error:", error);

      if (error.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email address already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Invalid email address format.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('The password is too weak.');
      } else {
        setAuthError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function clearError(field) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #f8fafc 100%)',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 460 }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack sx={{ mb: 1, alignItems: "center" }}>
              <UserPlusIcon />
              <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start building in minutes. No credit card required.
              </Typography>
            </Stack>

            {authError && (
              <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                {authError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: authError ? 2 : 4 }}
            >
              <Stack spacing={2.5}>
                {/* ---- Name ---- */}
                <TextField
                  label="Full name"
                  type="text"
                  fullWidth
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  inputProps={{ 'aria-label': 'Full name' }}
                />

                {/* ---- Email ---- */}
                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  inputProps={{ 'aria-label': 'Email address' }}
                />

                {/* ---- Password ---- */}
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError('password');
                    if (confirmPassword && errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  inputProps={{ 'aria-label': 'Password' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* ---- Confirm Password ---- */}
                <TextField
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError('confirmPassword');
                  }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  inputProps={{ 'aria-label': 'Confirm password' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirm password'
                              : 'Show confirm password'
                          }
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* ---- Terms Checkbox ---- */}
              <Box sx={{ mt: 2, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        clearError('terms');
                      }}
                      size="small"
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <Link
                        href="#"
                        underline="hover"
                        sx={{ fontWeight: 600 }}
                        onClick={(e) => e.preventDefault()}
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="#"
                        underline="hover"
                        sx={{ fontWeight: 600 }}
                        onClick={(e) => e.preventDefault()}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.terms && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ ml: 4, mt: 0.25, display: 'block' }}
                  >
                    {errors.terms}
                  </Typography>
                )}
              </Box>

              {/* ---- Submit Button ---- */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  or
                </Typography>
              </Divider>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}