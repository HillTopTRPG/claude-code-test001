import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import jaJP from 'antd/locale/ja_JP';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SystemsPage from './pages/systems/SystemsPage';
import NechronicaPage from './pages/systems/nechronica/NechronicaPage';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={jaJP}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/systems/nechronica" element={<NechronicaPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
