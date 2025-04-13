import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Board from './pages/board';
import TeamBoard from './pages/TeamBoard';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/board" element={<Board />}/>
        <Route path="/team/:teamId/board" element={<TeamBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;