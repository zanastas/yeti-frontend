import { PrivyProvider } from '@privy-io/react-auth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmdn9d3lq014sla0jmz0v8o7f'}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#3b82f6',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default MyApp;