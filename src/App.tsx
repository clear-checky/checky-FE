import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalyzePage from './pages/AnalyzePage';
import ChatPage from './pages/ChatPage';
import FaqPage from './pages/FaqPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/analyze/:taskId" element={<AnalyzePage />} />{' '}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Route>
    </Routes>
  );
}

export default App;
