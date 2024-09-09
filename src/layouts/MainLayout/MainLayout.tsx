import { ComponentType, FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, Header } from '@/components';
import { Toaster } from '@/components/Toast/toaster';

const MainLayout: FC = () => {
  return (
    <div className="w-full h-full bg-background-black min-h-screen max-w-screen flex flex-col">
      <Header />
      <main className="w-full flex-1 pt-8">
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
};

export default MainLayout as ComponentType;
