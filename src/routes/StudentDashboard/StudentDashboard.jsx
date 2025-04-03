import GridMenu from './GridMenu';
import LessonList from './LessonsList';
import { useContext, useState } from 'react';
import { AuthContext } from '@context/auth-context';

import './StudentDashboard.css';

function StudentDashboard() {
  const { userData } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('main');

  const returnToMain = () => {
    setCurrentView('main');
  };

  if (currentView === 'main') {
    return <GridMenu userData={userData} setCurrentView={setCurrentView} />;
  }

  return <LessonList returnToMain={returnToMain} mode={currentView} />;
}

export default StudentDashboard;
