import { useContext } from 'react';
import { AuthContext } from '@context/auth-context';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';

import './Header.css';

const { Header: AntHeader } = Layout;

function Header() {
  const { currentUser, signOut } = useContext(AuthContext);

  return (
    <AntHeader className="header">
      <Link to={'/dashboard'}>
        <div className="header-logo">Silente Jalisco</div>
      </Link>
      {currentUser && (
        <div className="user-info">
          Sesión activa: {currentUser.email}
          <Button type="primary" onClick={signOut}>
            Cerrar Sesión
          </Button>
        </div>
      )}
    </AntHeader>
  );
}

export default Header;
