import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [registros, setRegistros] = useState([])
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [filtroEmail, setFiltroEmail] = useState('')
  const navigate = useNavigate()

  const buscarRegistros = async () => {
    let query = supabase
      .from('ponto')
      .select('*')
      .gte('data_hora', `${dataSelecionada}T00:00:00`)
      .lte('data_hora', `${dataSelecionada}T23:59:59`)
      .order('data_hora', { ascending: true })

    if (filtroEmail.trim() !== '') {
      query = query.ilike('user_email', `%${filtroEmail.trim()}%`)
    }

    const { data, error } = await query

    if (!error) {
      setRegistros(data)
    } else {
      console.error('Erro ao buscar registros:', error)
    }
  }

  useEffect(() => {
    buscarRegistros()
  }, [dataSelecionada, filtroEmail])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== 'patrao@empresa.com') {
        navigate('/login')
      }
    }

    checkUser()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📅 Painel do Patrão</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Selecione a data:{' '}
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Filtrar por e-mail:{' '}
          <input
            type="text"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
            placeholder="ex: luigi@..."
            style={{ padding: '5px', width: '250px' }}
          />
        </label>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Funcionário</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tipo</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Horário</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Localização</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((reg, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{reg.user_email}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{reg.tipo}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(reg.data_hora).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {reg.latitude && reg.longitude ? (
                  <a
                    href={`https://www.google.com/maps?q=${reg.latitude},${reg.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📍 Ver no mapa
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
