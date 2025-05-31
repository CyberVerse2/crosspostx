import { PrivyClientConfig } from '@privy-io/react-auth'

export const privyConfig: PrivyClientConfig = {
  loginMethods: ['twitter', 'farcaster'],
  appearance: {
    theme: 'light',
    accentColor: '#1DA1F2',
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