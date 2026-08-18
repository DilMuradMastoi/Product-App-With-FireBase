import { useState } from 'react'
import { Link as RouterLink, useNavigate } from "react-router"; // or 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Navbar from './Navbar'

// Firebase Auth imports
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebaseconfig' 

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
  )
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
  )
}

function LockIcon() {
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </Box>
  )
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  const navigate = useNavigate()

  function validate() {
    const next = {}

    if (!email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address'
    }

    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setAuthError('')

    if (!validate()) return

    setLoading(true)

    try {
      // Firebase Authentication Sign-In
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      console.log('Signed in user:', user)

      // Navigate to products page on successful login
      navigate('/products')
    } catch (error) {
      console.error('Firebase Auth Error:', error.code, error.message)

      // Map Firebase error codes to friendly messages
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setAuthError('Invalid email or password. Please try again.')
          break
        case 'auth/too-many-requests':
          setAuthError('Too many failed attempts. Please try again later.')
          break
        default:
          setAuthError('Failed to sign in. Please check your credentials.')
      }
    } finally {
      setLoading(false)
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
        <Card
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 5,
            overflow: 'hidden',
            mb: 3,
            transition: '.3s',
            boxShadow: '0 10px 30px rgba(0,0,0,.12)',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 18px 40px rgba(0,0,0,.18)',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack style={{ alignItems: 'center' }}>
              <LockIcon />
              <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to sign in to your account
              </Typography>
            </Stack>

            {/* Display Firebase Authentication Error Alert */}
            {authError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {authError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                  }}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  slotProps={{
                    htmlInput: { 'aria-label': 'Email address' },
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  slotProps={{
                    input: {
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
                    },
                    htmlInput: { 'aria-label': 'Password' },
                  }}
                />
              </Stack>

              <Stack
              style={{
                display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
    marginBottom: '24px',
              }}  
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  href="#"
                  variant="body2"
                  underline="hover"
                  sx={{ fontWeight: 500, cursor: 'pointer' }}
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  or
                </Typography>
              </Divider>

              <Typography   variant="body2"
  
  sx={{ mt: 2 , color:"text.secondary",
  textAlign:"center",  }}>
                Don&apos;t have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  sx={{ fontWeight: 600, cursor: 'pointer' }}
                >
                  Sign up for free
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}