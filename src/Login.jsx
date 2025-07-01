import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert('Erro ao fazer login');
      console.log(error);
    } else {
      if (email === 'patrao@empresa.com') {
        navigate('/admin');
      } else {
        navigate('/funcionario');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        padding: '20px',
      }}
    >
      {/* LOGO COM ESTILO MODERNO */}
      <img
        src="/logo-fertil.png"
        alt="Logo Fértil Agrícola"
        style={{
          maxWidth: '350px',
          width: '100%',
          height: 'auto',
          marginBottom: '25px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          borderRadius: '12px',
        }}
      />

      <h1 style={{ color: '#1a1a1a', fontSize: '32px', marginBottom: '20px' }}>
        Login
      </h1>

      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '14px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            padding: '14px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: '14px',
            fontSize: '16px',
            borderRadius: '25px',
            border: 'none',
            backgroundColor: '#7bbb66',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Entrar
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        Ao entrar, você concorda com nossos termos de uso e política de privacidade.
      </p>
    </div>
  );
}
