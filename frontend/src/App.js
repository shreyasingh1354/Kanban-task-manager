import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import Board from './pages/board';
import PrivateRoute from './components/privateroute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;