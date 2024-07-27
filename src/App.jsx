import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { AuthContext } from '@context/auth-context';
import Login from '@routes/Login/Login';
import AdminDashboard from '@routes/AdminDashboard/AdminDashboard';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import NewLesson from '@routes/Lessons/NewLesson';
import ManageLesson from '@routes/Lessons/ManageLesson';

const { Content } = Layout;

function App() {
  const { currentUser, isAuthLoading } = useContext(AuthContext);

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
              <Route index element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* Handle authenticated users */}
          {currentUser && (
            <>
              {/* General Routes */}
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />

              {/* Lesson Routes */}
              <Route path="lecciones">
                <Route path="nueva" element={<NewLesson />} />
                <Route
                  path=":level/:name"
                  element={<ManageLesson lesssonId="/" />}
                />
              </Route>
            </>
          )}
        </Routes>
      </Content>
      <Footer />
    </Layout>
  );
}

export default App;
