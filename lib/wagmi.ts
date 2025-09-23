import { http, createConfig } from 'wagmi';
import { immutableZkEvmTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [immutableZkEvmTestnet],
  connectors: [
    injected(), // Passport will provide the injected connector
  ],
  transports: {
    [immutableZkEvmTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_TESTNET || undefined),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
