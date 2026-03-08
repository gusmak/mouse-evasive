import { Box, Typography, Card, CardContent, Divider, Stack, Chip } from '@mui/material'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'

const stack = ['React 18', 'TypeScript', 'Material UI v6', 'React Router v6', 'Vite']

export default function AboutPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>About</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>About this application</Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: 3,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RocketLaunchRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>MyApp</Typography>
              <Typography variant="body2" color="text.secondary">v1.0.0</Typography>
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            A modern React starter template with TypeScript, Material UI, and React Router.
            Clean structure, ready to build upon.
          </Typography>

          <Divider sx={{ mb: 2.5 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Tech Stack</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {stack.map(s => (
              <Chip key={s} label={s} variant="outlined" size="small" color="primary" />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
