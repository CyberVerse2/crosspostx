'use client'

import { useLogin, usePrivy } from '@privy-io/react-auth'
import { Button } from '../ui/Button'

export function LoginButton() {
  const { login } = useLogin()
  const { authenticated, user } = usePrivy()

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Welcome, {user?.farcaster?.username || user?.email || 'User'}!
        </span>
      </div>
    )
  }

  return (
    <Button
      onClick={login}
      className="bg-purple-500 hover:bg-purple-600 text-white"
    >
      Connect with Farcaster
    </Button>
  )
} 