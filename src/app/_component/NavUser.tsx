"use client"
import { useState, useEffect } from 'react'
import {
  Avatar, Typography, Menu, IconButton,
  Tooltip, MenuItem, ListItemIcon, ListItemText
} from '@mui/material'
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import ForumIcon from '@mui/icons-material/Forum';
import Confirmation from './Confirmation';
import { useUserStore } from '../../../stores/userStore';

export default function NavUser() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useUserStore()

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  };

  const handleLogout = () => {
    setConfirmationOpen(true)
  };

  const onConfirmLogout = () => {
    logout()
    window.location.href = '/auth/login'
  }

  // Don't render user data until component is mounted on client
  if (!mounted) {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <IconButton sx={{ p: 0 }}>
          <Avatar alt="User" src="/user.jpg" />
          <Typography sx={{ ml: 1 }} className="text-gray-600 text-sm">Loading...</Typography>
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={user?.email || 'User'}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User" src={user?.avatar || "/user.jpg"} />
          <Typography sx={{ ml: 1 }} className="text-gray-600 hover:text-gray-900 text-sm">{user?.username || 'User'}</Typography>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <EnhancedEncryptionIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <ForumIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Messages</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <Confirmation title="Logout" content="Are you sure you want to logout?"
        open={confirmationOpen} setOpen={setConfirmationOpen} onConfirm={onConfirmLogout} />
    </Box>
  )
}
