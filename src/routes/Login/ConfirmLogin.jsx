import { useState, useEffect } from 'react';
import { authenticateWithMagicLink } from '@libs/firebase/authentication';
import { Button, Form, Input, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

import './Login.css';

function ConfirmLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const NO_EMAIL_STORED = 'NO_EMAIL_STORED';

  const handleLogin = async () => {
    try {
      const userCredential = await authenticateWithMagicLink();
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch (e) {
      if (e.message === NO_EMAIL_STORED) {
        setError(
          'Por favor, ingresa tu correo electrónico para iniciar sesión.'
        );
      }
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="login-container">
      {error && <Alert message={error} type="error" />}
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu correo electrónico.',
            },
          ]}
        >
          <Input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError(null);
            }}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              window.localStorage.setItem('emailForSignIn', username);
              handleLogin();
            }}
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ConfirmLogin;
