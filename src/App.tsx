import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import TeacherRoute from './components/TeacherRoute'
import Login from './pages/Login'
import Case from './pages/Case'
import Conclusion from './pages/Conclusion'
import Museum from './pages/Museum'
import MuseumRoom from './pages/MuseumRoom'
import './styles.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/caso" element={<Case />} />
          <Route path="/museu" element={<Museum />} />
          <Route path="/museu/:room" element={<MuseumRoom />} />
          <Route path="/conclusao" element={<Conclusion />} />
          <Route path="/professor" element={<TeacherRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
