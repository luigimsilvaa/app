import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Funcionario from './Funcionario'
import Admin from './Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/funcionario" element={<Funcionario />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Login />} />
    </Routes>
  )
}
