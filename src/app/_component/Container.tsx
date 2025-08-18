
import { Box } from '@mui/material'
import React from 'react'

const drawerWidth = process.env.NEXT_PUBLIC_DRAWER_WIDTH || 280;

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box className="flex-1 flex flex-col">
      <Box
        component="main"
        className="flex-1 pt-16"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { md: `${drawerWidth}px` },
        }}
      >
        <Box className="p-6">
          {children}
        </Box>
      </Box>
    </Box>
  )
}