import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Funcionario() {
  const [pontoInicio, setPontoInicio] = useState(null);
  const [pontoFim, setPontoFim] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        buscarPontos(session.user.email);
      }
    };
    getSession();
  }, []);

  const buscarPontos = async (email) => {
    const { data, error } = await supabase
      .from('ponto')
      .select('*')
      .eq('user_email', email)
      .gte('data_hora', new Date().toISOString().slice(0, 10))
      .order('data_hora', { ascending: true });

    if (!error && data.length > 0) {
      const inicio = data.find(p => p.tipo === 'iniciar');
      const fim = data.find(p => p.tipo === 'encerrar');
      setPontoInicio(inicio);
      setPontoFim(fim);
    }
  };

  const obterLocalizacao = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocalização não suportada"));
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const iniciarJornada = async () => {
    try {
      const { latitude, longitude } = await obterLocalizacao();
      const { error } = await supabase.from('ponto').insert([
        {
          user_email: user.email,
          tipo: 'iniciar',
          data_hora: new Date(),
          latitude,
          longitude,
        }
      ]);
      if (!error) {
        alert('Jornada iniciada com sucesso!');
        buscarPontos(user.email);
      }
    } catch (err) {
      if (window.location.hostname === 'localhost') {
        const confirmar = confirm("Erro na geolocalização.\nDeseja iniciar mesmo assim (modo desenvolvedor)?");
        if (confirmar) {
          const { error } = await supabase.from('ponto').insert([
            {
              user_email: user.email,
              tipo: 'iniciar',
              data_hora: new Date(),
              latitude: null,
              longitude: null,
            }
          ]);
          if (!error) {
            alert('Jornada iniciada (modo desenvolvedor)');
            buscarPontos(user.email);
          }
        }
      } else {
        alert('Erro ao obter localização. Verifique permissões.');
      }
    }
  };

  const encerrarExpediente = async () => {
    try {
      const { latitude, longitude } = await obterLocalizacao();
      const { error } = await supabase.from('ponto').insert([
        {
          user_email: user.email,
          tipo: 'encerrar',
          data_hora: new Date(),
          latitude,
          longitude,
        }
      ]);
      if (!error) {
        alert('Expediente encerrado com sucesso!');
        buscarPontos(user.email);
      }
    } catch (err) {
      if (window.location.hostname === 'localhost') {
        const confirmar = confirm("Erro na geolocalização.\nDeseja encerrar mesmo assim (modo desenvolvedor)?");
        if (confirmar) {
          const { error } = await supabase.from('ponto').insert([
            {
              user_email: user.email,
              tipo: 'encerrar',
              data_hora: new Date(),
              latitude: null,
              longitude: null,
            }
          ]);
          if (!error) {
            alert('Expediente encerrado (modo desenvolvedor)');
            buscarPontos(user.email);
          }
        }
      } else {
        alert('Erro ao obter localização. Verifique permissões.');
      }
    }
  };

  const encerrarSessao = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '400px',
        padding: '2rem',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '28px' }}>Bem-vindo(a),<br />{user?.email}</h2>

        {pontoInicio ? (
          <p style={{ marginBottom: '1rem' }}>Iniciado às: {new Date(pontoInicio.data_hora).toLocaleString()}</p>
        ) : (
          <button
            onClick={iniciarJornada}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#74c16a',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            Iniciar Jornada
          </button>
        )}

        {pontoFim ? (
          <p style={{ marginBottom: '1rem' }}>Encerrado às: {new Date(pontoFim.data_hora).toLocaleString()}</p>
        ) : (
          pontoInicio && (
            <button
              onClick={encerrarExpediente}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              Encerrar Expediente
            </button>
          )
        )}

        <button
          onClick={encerrarSessao}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Encerrar Sessão
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '14px', color: '#555' }}>
          Ao utilizar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </div>
  );
}
