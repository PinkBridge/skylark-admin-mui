'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/app/theme'
import HeaderBar from '../_component/HeaderBar'
import MenuBar from '../_component/MenuBar'
import Container from '../_component/Container'
import { useUserStore } from '../../../stores/userStore';
import { api } from '../../../lib/api';
import '../globals.css';


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useUserStore.getState()
  const { setUser, user } = useUserStore()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getUser = async () => {
    try {
      const result = await api("/api/user/me", {
        method: "GET",
      });
      setUser(result.data)
    } catch (error) {
      console.error('Failed to get user:', error);
    }
  }

  useEffect(() => {
    // Get user data on client side only
    if (isAuthenticated) {
      getUser()
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
  }, [isAuthenticated])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="flex h-screen bg-white">
        {mobileOpen && (
          <Box
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={handleDrawerToggle}
          />
        )}
        <HeaderBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <MenuBar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} menus={user?.menus || []} />
        <Container>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
