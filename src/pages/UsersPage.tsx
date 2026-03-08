import { useState } from 'react'
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Chip, IconButton, TextField,
  InputAdornment, Button,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'

type User = { id: number; name: string; email: string; role: string; status: 'Active' | 'Inactive' }

const initialUsers: User[] = [
  { id: 1, name: 'Alice Nguyen', email: 'alice@email.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Tran', email: 'bob@email.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol Le', email: 'carol@email.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Pham', email: 'david@email.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eva Hoang', email: 'eva@email.com', role: 'Viewer', status: 'Active' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: number) => setUsers(prev => prev.filter(u => u.id !== id))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Users</Typography>
          <Typography color="text.secondary">Manage your team members</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddRoundedIcon />} sx={{ mt: 0.5 }}>
          Add User
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.light', fontSize: 13 }}>
                        {user.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'Active' ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><EditRoundedIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}
