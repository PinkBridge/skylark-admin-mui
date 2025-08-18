'use client';

import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';

export default function Introduction({ title, description }: { title: string, description: string }) {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7ff 30%, #fafbfc 100%)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'left' }}>
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#1a202c',
                mb: 1.5,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#4a5568',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
}