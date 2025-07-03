import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { PrivyProvider } from '@privy-io/react-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcn7qzud00h2lg0llcviw597"
      config={{
        loginMethods: ['wallet'],
        embeddedWallets: { createOnLogin: 'users-without-wallets' },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
