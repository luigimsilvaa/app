import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Funcionario() {
  const [pontoInicio, setPontoInicio] = useState(null)
  const [pontoFim, setPontoFim] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
      } else {
        setUser(session.user)
        buscarPontos(session.user.email)
      }
    }

    getSession()
  }, [])

  const buscarPontos = async (email) => {
    const { data, error } = await supabase
      .from('ponto')
      .select('*')
      .eq('user_email', email)
      .gte('data_hora', new Date().toISOString().slice(0, 10))
      .order('data_hora', { ascending: true })

    if (!error && data.length > 0) {
      const inicio = data.find(p => p.tipo === 'iniciar')
      const fim = data.find(p => p.tipo === 'encerrar')
      setPontoInicio(inicio)
      setPontoFim(fim)
    }
  }

  const iniciarJornada = async () => {
    const { error } = await supabase.from('ponto').insert([
      {
        user_email: user.email,
        tipo: 'iniciar',
        data_hora: new Date()
      }
    ])
    if (!error) {
      alert('Jornada iniciada com sucesso!')
      buscarPontos(user.email)
    } else {
      alert('Erro ao iniciar jornada')
      console.log(error)
    }
  }

  const encerrarExpediente = async () => {
    const { error } = await supabase.from('ponto').insert([
      {
        user_email: user.email,
        tipo: 'encerrar',
        data_hora: new Date()
      }
    ])
    if (!error) {
      alert('Expediente encerrado com sucesso!')
      buscarPontos(user.email)
    } else {
      alert('Erro ao encerrar expediente')
      console.log(error)
    }
  }

  const encerrarSessao = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bem-vindo(a), {user?.email}</h2>

      {pontoInicio ? (
        <p>Iniciado às: {new Date(pontoInicio.data_hora).toLocaleString()}</p>
      ) : (
        <button
          onClick={iniciarJornada}
          style={{
            marginTop: '1rem',
            padding: '0.7rem 2rem',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Iniciar Jornada
        </button>
      )}

      {pontoFim ? (
        <p>Expediente encerrado às: {new Date(pontoFim.data_hora).toLocaleString()}</p>
      ) : (
        pontoInicio && (
          <button
            onClick={encerrarExpediente}
            style={{
              marginTop: '1rem',
              padding: '0.7rem 2rem',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Encerrar Expediente
          </button>
        )
      )}

      <button
        onClick={encerrarSessao}
        style={{
          marginTop: '2rem',
          padding: '0.7rem 2rem',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Encerrar Sessão
      </button>
    </div>
  )
}
