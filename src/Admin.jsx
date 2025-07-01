import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [registrosDia, setRegistrosDia] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().slice(0, 10));
  const [filtroEmail, setFiltroEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || session.user.email !== 'patrao@empresa.com') {
        navigate('/login');
      } else {
        setUser(session.user);
        buscarRegistros(dataSelecionada);
      }
    };
    checarSessao();
  }, [dataSelecionada]);

  const buscarRegistros = async (dataISO) => {
    const { data } = await supabase
      .from('ponto')
      .select('user_email, tipo, data_hora, latitude, longitude')
      .gte('data_hora', dataISO + 'T00:00:00Z')
      .lte('data_hora', dataISO + 'T23:59:59Z')
      .order('user_email, data_hora', { ascending: true });

    if (!data) return;

    const porUsuario = {};
    data.forEach(p => {
      if (!porUsuario[p.user_email]) porUsuario[p.user_email] = {};
      porUsuario[p.user_email][p.tipo] = {
        data_hora: p.data_hora,
        latitude: p.latitude,
        longitude: p.longitude
      };
    });

    const registros = Object.entries(porUsuario).map(([email, tipos]) => ({
      email,
      entrada: tipos.iniciar?.data_hora || null,
      saida: tipos.encerrar?.data_hora || null,
      latEntrada: tipos.iniciar?.latitude || null,
      lngEntrada: tipos.iniciar?.longitude || null,
      latSaida: tipos.encerrar?.latitude || null,
      lngSaida: tipos.encerrar?.longitude || null,
    }));

    setRegistrosDia(registros);
  };

  const calcularHoras = (entrada, saida) => {
    if (!entrada || !saida) return 0;
    const diffMs = new Date(saida) - new Date(entrada);
    return +(diffMs / (1000 * 60 * 60)).toFixed(2);
  };

  const getLink = (lat, lng) =>
    lat && lng
      ? <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">📍 Ver</a>
      : '-';

  const registrosFiltrados = registrosDia.filter(r =>
    filtroEmail.trim() === '' || r.email.toLowerCase().includes(filtroEmail.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        padding: '2rem'
      }}>
        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-fertil.png" alt="Logo Fértil Agrícola" style={{ maxWidth: '200px', marginBottom: '1rem' }} />
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Painel do Patrão</h1>
        </div>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600' }}>
            Data:
            <input
              type="date"
              value={dataSelecionada}
              onChange={e => setDataSelecionada(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                marginTop: '0.5rem'
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600' }}>
            Filtrar por funcionário:
            <input
              type="text"
              value={filtroEmail}
              onChange={e => setFiltroEmail(e.target.value)}
              placeholder="ex: joao@empresa.com"
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                marginTop: '0.5rem'
              }}
            />
          </label>
        </div>

        {/* Tabela */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
            fontSize: '0.95rem',
            color: '#333'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#eaeaea' }}>
                <th style={estiloTh}>Funcionário</th>
                <th style={estiloTh}>Entrada</th>
                <th style={estiloTh}>Saída</th>
                <th style={estiloTh}>Horas</th>
                <th style={estiloTh}>Localização Entrada</th>
                <th style={estiloTh}>Localização Saída</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map(r => {
                  const horas = calcularHoras(r.entrada, r.saida);
                  const isIncompleto = horas < 8;
                  return (
                    <tr key={r.email} style={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <td style={estiloTd}>{r.email}</td>
                      <td style={estiloTd}>{r.entrada ? new Date(r.entrada).toLocaleTimeString() : '-'}</td>
                      <td style={estiloTd}>{r.saida ? new Date(r.saida).toLocaleTimeString() : '-'}</td>
                      <td style={{
                        ...estiloTd,
                        fontWeight: '600',
                        color: isIncompleto ? '#d93025' : 'green'
                      }}>
                        {horas} h {isIncompleto && '⚠️'}
                      </td>
                      <td style={estiloTd}>{getLink(r.latEntrada, r.lngEntrada)}</td>
                      <td style={estiloTd}>{getLink(r.latSaida, r.lngSaida)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const estiloTh = {
  padding: '12px 10px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.95rem'
};

const estiloTd = {
  padding: '10px',
  fontSize: '0.9rem',
  borderBottom: '1px solid #eee'
};
