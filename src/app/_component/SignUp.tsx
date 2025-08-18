import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Button
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  Settings as SettingsIcon,
  Build as BuildIcon,
  ThumbUp as ThumbUpIcon,
  AutoAwesome as SparkleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { toast } from 'material-react-toastify';
import { api } from '../../../lib/api';
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

export default function SignUp() {
  const { isAuthenticated } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
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
          field === 'agreeToTerms' ? event.target.checked : event.target.value,
      });
    };
  // handle register
  const handleRegister = async (formData: any) => {
    // Get form data
    const username = formData.username.trim()
    const email = formData.email.trim()
    const password = formData.password.trim()
    const confirmPassword = formData.confirmPassword.trim()
    // Check username format
    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email format")
      return;
    }
    // Check password format
    if (
      !password || password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      toast.error("Password must be at least 8 characters, with a letter, number, and symbol")
      return;
    }
    // Check confirm password format
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return;
    }
    // Register
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username: username, email: email, password: password }),
    });
    toast.success("✨ Sign up successfully!")
    await sleep(500)
    window.location.href = "/auth/login"
  }
  // handle submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRegister(formData)
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
                Sign up
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange('username')}
                  placeholder="Enter your username"
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="Create a password"
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

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Confirm your password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
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

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="agreeToTerms"
                        color="primary"
                        checked={formData.agreeToTerms}
                        onChange={handleChange('agreeToTerms')}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I agree to the{' '}
                        <Link href="#" sx={{ textDecoration: 'none' }}>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" sx={{ textDecoration: 'none' }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!formData.agreeToTerms}
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
                  Create Account
                </Button>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      href="/auth/login"
                      sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign in
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