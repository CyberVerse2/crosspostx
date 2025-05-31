'use client'

import { useLogout, usePrivy } from '@privy-io/react-auth'
import { Button } from '../ui/Button'

export function LogoutButton() {
  const { logout } = useLogout()
  const { authenticated } = usePrivy()

  if (!authenticated) {
    return null
  }

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="text-gray-600 border-gray-300 hover:bg-gray-50"
    >
      Logout
    </Button>
  )
} 