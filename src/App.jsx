import { Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import PreviewPage from './pages/PreviewPage';
import Login from './pages/Login';
import Profile from './pages/Profile';

export default function App() {
  return (
    <PortfolioProvider>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </main>
    </PortfolioProvider>
  );
}
