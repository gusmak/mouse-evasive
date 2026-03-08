import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Typography variant="h1" fontWeight={800} sx={{ fontSize: '6rem', color: 'primary.main' }}>404</Typography>
      <Typography variant="h5" fontWeight={600}>Page not found</Typography>
      <Typography color="text.secondary">The page you're looking for doesn't exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 1 }}>Go Home</Button>
    </Box>
  )
}
