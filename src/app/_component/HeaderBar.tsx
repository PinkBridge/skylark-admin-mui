'use client';

import { Box, Breadcrumbs, Typography, Link, Toolbar, Avatar, AppBar, Button, Badge } from '@mui/material'
import React from 'react'
import NavUser from './NavUser'
import IconButton from '@mui/material/IconButton'
import MailIcon from '@mui/icons-material/Mail';

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const drawerWidth = process.env.NEXT_PUBLIC_DRAWER_WIDTH || 280;

export function HeaderToolbar({ mobileOpen, handleDrawerToggle }: { mobileOpen: boolean; handleDrawerToggle: () => void }) {
  return (
    <Toolbar
      className="flex items-center justify-between px-6 py-4"
      sx={{
        background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
      }}
    >
      <Box className="flex items-center space-x-4">
        <IconButton
          onClick={handleDrawerToggle}
          className="md:hidden p-2 rounded-lg hover:bg-purple-100"
        >
          <MenuIcon />
        </IconButton>

        <Box className="flex items-center space-x-2">
          <Breadcrumbs className="ml-2">
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm"
              underline="hover"
            >
              Building Your Application
            </Link>
            <Typography className="text-gray-900 text-sm">
              Data Fetching
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>


      <Box className="flex items-center space-x-3 pr-4">
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" sx={{ color: 'black', mr: 2, backgroundColor: 'white' }}>
          <Badge badgeContent={4} color="error">
            <MailIcon width={24} height={24} />
          </Badge>
        </IconButton>
        <NavUser />
      </Box>
    </Toolbar>
  )
}

export default function HeaderBar({ mobileOpen, handleDrawerToggle }: { mobileOpen: boolean; handleDrawerToggle: () => void }) {
  return (
    <AppBar
      position="fixed"
      className="z-40"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        boxShadow: '2px 0 11px rgba(0,0,0,0.1)',
        top: 0,
        background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
      }}
    >
      <HeaderToolbar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
    </AppBar>
  )
}