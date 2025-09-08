import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-primary w-full">
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
