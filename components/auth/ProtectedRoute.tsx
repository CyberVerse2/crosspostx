'use client'

import { useUser } from '../../hooks/useUser'
import { LoginButton } from './LoginButton'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { authenticated, loading } = useUser()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to CrossPostX</h1>
            <p className="text-gray-600 mb-6">
              Connect your Twitter account to start crossposting to Farcaster
            </p>
            <LoginButton />
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
} 