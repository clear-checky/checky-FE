import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main className="w-full pt-18">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
