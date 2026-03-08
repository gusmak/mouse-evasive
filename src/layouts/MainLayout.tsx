import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton,
  Avatar, Chip, useTheme, useMediaQuery, Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Home', path: '/', icon: <HomeRoundedIcon /> },
  { label: 'Users', path: '/users', icon: <PeopleRoundedIcon /> },
  { label: 'About', path: '/about', icon: <InfoRoundedIcon /> },
]

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RocketLaunchRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary">MyApp</Typography>
      </Box>

      <Divider />

      {/* Nav */}
      <List sx={{ px: 1, pt: 1, flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false) }}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 400 }} />
                {active && <Chip label="•" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', height: 18, fontSize: 10 }} />}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* User */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14 }}>U</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>User Name</Typography>
          <Typography variant="caption" color="text.secondary">user@email.com</Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '1px 0 0 #f1f5f9',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar (mobile only) */}
        {isMobile && (
          <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #f1f5f9' }}>
            <Toolbar>
              <IconButton edge="start" onClick={() => setMobileOpen(true)} color="inherit" sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700} color="primary" sx={{ ml: 1 }}>MyApp</Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
