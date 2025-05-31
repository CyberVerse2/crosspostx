'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { privyConfig } from '../../lib/privy/config'

interface PrivyClientProviderProps {
  children: React.ReactNode
}

export function PrivyClientProvider({ children }: PrivyClientProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={privyConfig}
    >
      {children}
    </PrivyProvider>
  )
} 