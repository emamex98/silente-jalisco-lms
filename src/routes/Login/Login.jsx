import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser, sendLoginLink } from '@libs/firebase/authentication';
import { Button, Input, Alert, Modal, Result } from 'antd';

import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const INVALID_EMAIL = 'auth/invalid-email';
  const INVALID_CREDENTIALS = 'auth/invalid-credential';
  const QUOTA_EXEECED = 'auth/quota-exceeded';

  const resetFormFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async () => {
    try {
      if (!username) {
        setError('Por favor, ingresa tu correo electrónico.');
        return;
      }

      await sendLoginLink(username);
      resetFormFields();
      setIsOpen(true);
    } catch (e) {
      if (e.code.includes(INVALID_EMAIL)) {
        setError('El correo que ingresaste es inválido.');
        return;
      }

      if (e.code.includes(QUOTA_EXEECED)) {
        setShowPasswordInput(true);
        return;
      }

      setError(e.message);
    }
  };

  const handlePasswordLogin = async () => {
    try {
      const userCredential = await signInUser(username, password);
      if (userCredential) {
        resetFormFields();
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.message.includes(INVALID_CREDENTIALS)) {
        setError('El usuario o contraseña son inválidos.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión.');
      }
    }
  };

  return (
    <section className="login-container">
      <h1 className="login-title">
        👋 <br /> ¡Te damos la bienvenida!
      </h1>
      <h2 className="login-subtitle">
        Ingresa tu correo electrónico para iniciar sesión:
      </h2>

      {error && <Alert message={error} type="error" className="login-error" />}

      <Input
        className="login-input"
        size="large"
        placeholder="Correo Electrónico"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          setError(null);
        }}
      />

      {showPasswordInput && (
        <Input.Password
          className="login-input"
          placeholder="Contraseña"
          size="large"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(null);
          }}
        />
      )}

      <Button
        type="primary"
        onClick={() => {
          showPasswordInput ? handlePasswordLogin() : handleSubmit();
        }}
        size="large"
      >
        Iniciar Sesión
      </Button>

      <Modal centered open={isOpen} closable={false} footer={<></>}>
        <Result
          status="success"
          title="¡Revisa tu correo electrónico!"
          subTitle="Te enviamos un correo con instrucciones para iniciar sesión."
        />
      </Modal>
    </section>
  );
}

export default Login;
