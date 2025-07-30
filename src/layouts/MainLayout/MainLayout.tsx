import { Provider } from 'jotai';
import { ComponentType, FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, Header } from '@/components';
import { Toaster } from '@/components/Toast/toaster';

const MainLayout: FC = () => {
  return (
    <Provider>
      <div className="w-full h-full bg-background-black min-h-screen max-w-screen flex flex-col">
        <Header />
        <main className="w-full flex-1">
          <Outlet />
        </main>
        <Toaster />
        <Footer />
      </div>
    </Provider>
  );
};

export default MainLayout as ComponentType;
