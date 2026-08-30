// =============================================================================
// main.jsx — application entry point. Wires up the two providers the app needs:
//   • Redux <Provider>            → client/UI state (filters, favorites)
//   • React Query <QueryClient…>  → server state (cached product fetch)
// The order doesn't matter; both simply need to wrap <App/>.
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store } from './store/index.js';
import App from './App.jsx';

// Styles: tokens first (so variables exist), then global rules.
import './styles/variables.css';
import './styles/global.css';

// One QueryClient for the whole app. Defaults here apply to every query unless
// a hook overrides them (useProducts sets its own staleTime/gcTime).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // don't refetch just because the tab regained focus
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
