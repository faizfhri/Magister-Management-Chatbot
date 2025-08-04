import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FaqPage from './pages/FaqPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-200 flex justify-between">
        <Link to="/" className="text-blue-600 font-bold">FAQ</Link>
        <Link to="/deleteuser" className="text-blue-600 font-bold">Data User</Link>
      </div>

      <Routes>
        <Route path="/" element={<FaqPage />} />
        <Route path="/deleteuser" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
