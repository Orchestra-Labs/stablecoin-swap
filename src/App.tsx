import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Loader, ScrollToTop } from '@/components';

import { AppRouter } from './app/Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Suspense
          fallback={
            <div className="w-screen h-screen">
              <Loader />
            </div>
          }
        >
          <BrowserRouter>
            <ScrollToTop />
            <AppRouter />
          </BrowserRouter>
        </Suspense>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
