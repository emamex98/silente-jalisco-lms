import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '@libs/firebase/authentication';
import { Button, Form, Input, Alert } from 'antd';

import './Login.css';

const INVALID_CREDENTIALS = 'auth/invalid-credential';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const resetFormFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    <div className="login-container">
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
          label="Contraseña"
          name="password"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa tu contraseña.',
            },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
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
          <Button type="primary" onClick={handleSubmit}>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert message={error} type="error" />}
    </div>
  );
}

export default Login;
