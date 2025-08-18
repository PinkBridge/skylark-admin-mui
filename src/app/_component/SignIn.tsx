import { Box, Container, Typography, Card, CardContent, TextField, InputAdornment, IconButton, FormControlLabel, Checkbox, Link, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  Settings as SettingsIcon,
  Build as BuildIcon,
  ThumbUp as ThumbUpIcon,
  AutoAwesome as SparkleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { api } from '../../../lib/api';
import { toast } from 'material-react-toastify';
import { sleep } from '../../../lib/utils';
import { useUserStore } from '../../../stores/userStore';

const features = [
  {
    icon: <SettingsIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
    title: 'Adaptable performance',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <BuildIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
    title: 'Built to last',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
    title: 'Great user experience',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <SparkleIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];


export default function SignIn() {
  const { setToken, setAuthenticated, isAuthenticated } = useUserStore()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  if (typeof window !== "undefined" && isAuthenticated) {
    window.location.href = "/admin"
  }

  // handle change
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]:
          field === 'rememberMe' ? event.target.checked : event.target.value,
      });
    };

  // handle login
  const handleLogin = async (email: string, password: string) => {
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email format");
      return
    }
    // Check password format
    if (
      !password || password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      toast.error("Password must be at least 8 characters, with a letter, number, and symbol");
      return
    }
    // login
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    setToken(res.data)
    setAuthenticated(true)
    toast.success("✨ Sign in successfully!")
    // sleeping 1000ms is good to users' feeling
    await sleep(1000)
    window.location.href = "/admin"
  }
  // handle submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const email = formData.email.trim()
    const password = formData.password.trim()
    handleLogin(email, password)
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, color: 'white', maxWidth: 500 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #00bcd4, #2196f3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 'bold' }}
              >
                QA
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Quick Admin
            </Typography>
          </Box>

          <Box>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3 }}>
                <Box sx={{ mr: 2, mt: 0.5 }}>{feature.icon}</Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.9, lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ padding: 4 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}
              >
                Sign in
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="your@email.com"
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="remember"
                        color="primary"
                        checked={formData.rememberMe}
                        onChange={handleChange('rememberMe')}
                      />
                    }
                    label="Remember me"
                  />
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                  >
                    Forgot your password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  Sign in
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      href="/auth/register"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  )
}