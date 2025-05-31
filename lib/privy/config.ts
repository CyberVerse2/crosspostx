import { PrivyClientConfig } from '@privy-io/react-auth'

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['farcaster'],
  appearance: {
    theme: 'light',
    accentColor: '#8B5CF6',
    logo: '/logo.png',
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: 'smartWalletOnly',
    },
  },
} 