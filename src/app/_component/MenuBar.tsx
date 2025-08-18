"use client"
import { Box, ListItemIcon, ListItemButton, ListItem, List, Divider, ListItemText, Typography, Drawer, Icon, Card, CardMedia, CardContent, Button, CardActions } from '@mui/material'
import React from 'react'
import { MenuItem } from '../../../stores/userStore';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const drawerWidth = 280;

export default function MenuBar({ mobileOpen, handleDrawerToggle, menus }:
  { mobileOpen: boolean; handleDrawerToggle: () => void, menus: MenuItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleItemClick = (itemPath: string) => {
    router.push(itemPath);
  };

  const drawer = (
    <Box
      className="h-full flex flex-col text-gray-700 mb-6"
      sx={{
        background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
      }}
    >
      <Box className="p-3 flex items-center ml-3">
        <Box
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(45deg, #8b5cf6, #6b7280)',
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
        <Box>
          <Typography className="text-lg font-bold text-black tracking-wider" variant="h6" component="h6">
            Quick Admin
          </Typography>
          <Typography className="text-sm font-semibold tracking-wider text-gray-500" variant="body2" component="p">
            Community v1.0.1
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(139, 92, 246, 0.08)' }} />
      <Box className="flex-1 overflow-y-auto">
        {menus.map((section: MenuItem) => (
          <Box key={section.title} className="mb-2">
            <Typography className="px-4 py-2 text-xs font-semibold text-gray-600 tracking-wider" sx={{
              fontWeight: 'bold',
            }}>
              {section.title}
            </Typography>
            <List className="px-10">
              {section.children?.map((item: MenuItem) => (
                <ListItem key={item.id} disablePadding className="mb-1">
                  <ListItemButton
                    onClick={() => handleItemClick(item.path)}
                    sx={{
                      backgroundColor: pathname === item.path ? 'rgba(11, 11, 19, 0.04)' : 'transparent',
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{ color: pathname === item.path ? '#8b5cf6' : '#6b7280' }}>
                        <Icon>{item.icon}</Icon>
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={item.name}
                      className="text-sm font-semibold tracking-wider font-bold"
                      sx={{ color: pathname === item.path ? '#8b5cf6' : '#6b7280', fontSize: '0.9rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
      <Card sx={{ maxWidth: 345, zIndex: 1000, width: '90%', margin: '0 auto' }}>
        <CardMedia
          image="/HummingBird.png"
          title="User"
          sx={{ height: 140, width: '100%' }}
        />
        <CardActions className="flex justify-end">
          <Button size="small" variant="contained" color="primary">Close</Button>
          <Button size="small" variant="contained" color="primary">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
  return (
    <Box
      component="nav"
      className="fixed top-0 left-0 z-30 h-full"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
      }}
    >

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="md:hidden"
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        className="hidden md:block"
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 50%, #f3f4ff 100%)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}