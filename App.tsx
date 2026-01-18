
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './layouts/MasterLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import AITools from './pages/AITools';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MasterLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="ai-tools" element={<AITools />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
