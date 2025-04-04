import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { AuthContext } from '@context/auth-context';
import { getUserData } from '@libs/firebase/authentication';
import Login from '@routes/Login/Login';
import ConfirmLogin from '@routes/Login/ConfirmLogin';
import AdminDashboard from '@routes/AdminDashboard/AdminDashboard';
import StudentDashboard from '@routes/StudentDashboard/StudentDashboard';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import NewLesson from '@routes/Lessons/NewLesson';
import ManageLesson from '@routes/Lessons/ManageLesson';
import LearnPracticeLesson from '@routes/Lessons/LearnPracticeLesson';

const { Content } = Layout;

function StudentRoutes() {
  return useRoutes([
    { path: '/', element: <Navigate to="/dashboard" /> },
    { path: 'dashboard', element: <StudentDashboard /> },
    {
      path: 'lecciones',
      children: [
        { path: ':level/:name/:modep', element: <LearnPracticeLesson /> },
      ],
    },
  ]);
}

function AdminRoutes() {
  return useRoutes([
    { path: '/', element: <Navigate to="/dashboard" /> },
    { path: 'dashboard', element: <AdminDashboard /> },
    {
      path: 'lecciones',
      children: [
        { path: 'nueva', element: <NewLesson /> },
        { path: ':level/:name', element: <ManageLesson /> },
      ],
    },
  ]);
}

function App() {
  const { currentUser, setUserData, userData, isAuthLoading } =
    useContext(AuthContext);

  const isAdmin = userData.role === 'admin';

  useEffect(() => {
    const fetchUserData = async (userCredential) => {
      const { displayName, role, level } = await getUserData(userCredential);
      setUserData({
        name: displayName ?? 'usuario',
        role: role ?? 'student',
        level: level ?? 'A1',
      });
    };

    fetchUserData(currentUser);
  }, [setUserData, currentUser]);

  if (isAuthLoading) {
    return <Spin spinning={isAuthLoading} fullscreen />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content>
        <Routes>
          {/* Handle unauthenticated users */}
          {!currentUser && (
            <>
              <Route path="/confirmar-login" element={<ConfirmLogin />} />
              <Route index element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* Handle authenticated students */}
          {currentUser && !isAdmin && (
            <Route path="/*" element={<StudentRoutes />} />
          )}

          {/* Handle authenticated admins */}
          {currentUser && isAdmin && (
            <Route path="/*" element={<AdminRoutes />} />
          )}
        </Routes>
      </Content>
      <Footer />
    </Layout>
  );
}

export default App;
