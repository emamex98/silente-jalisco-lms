import { useContext, useState } from 'react';
import { AuthContext } from '@context/auth-context';
import { Row, Col, Menu } from 'antd';
import './AdminDashboard.css';

import Lessons from './Lessons';

const menuItems = [
  {
    key: 'lessons',
    label: 'Lecciones',
  },
  // {
  //   key: 'levels',
  //   label: 'Niveles',
  // },
  // {
  //   key: 'students',
  //   label: 'Estudiantes',
  // },
];

function AdminDashboard() {
  const { currentUser, signOut } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('lessons');

  const handleClick = (e) => {
    setCurrentView(e.key);
  };

  return (
    <Row>
      <Col span={6} className="admin-dashboard-sidebar">
        <Menu
          defaultSelectedKeys={['lessons']}
          mode="inline"
          className="admin-dashboard-sidebar-menu"
          items={menuItems}
          onClick={handleClick}
        />
      </Col>
      <Col span={18} className="admin-dashboard-content">
        {currentView === 'lessons' && <Lessons />}
        {currentView === 'levels' && <>Niveles</>}
        {currentView === 'students' && <>Estudiantes</>}
      </Col>
    </Row>
  );
}
export default AdminDashboard;
