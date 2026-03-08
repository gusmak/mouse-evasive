import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/detail', element: <DetailPage /> },
  { path: '*', element: <NotFoundPage /> },
])
