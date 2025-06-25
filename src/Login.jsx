import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert('Erro ao fazer login')
      console.log(error)
    } else {
      if (email === 'patrao@empresa.com') {
        navigate('/admin')
      } else {
        navigate('/funcionario')
      }
    }
  }

  useEffect(() => {
    const verificarSessao = async () => {
      const { data } = await supabase.auth.getSession()
      const sessao = data?.session

      if (sessao?.user?.email === 'patrao@empresa.com') {
        navigate('/admin')
      } else if (sessao?.user) {
        navigate('/funcionario')
      }
    }

    verificarSessao()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: '10px',
          width: '100%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
        }}
      >
        Entrar
      </button>
    </div>
  )
}
