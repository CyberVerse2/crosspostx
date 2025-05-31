'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { User } from '../types'
import { getUserByPrivyId, createUser } from '../lib/supabase/database'

export function useUser() {
  const { authenticated, user: privyUser } = usePrivy()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      if (!authenticated || !privyUser?.id) {
        setUser(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Try to get existing user
        let dbUser = await getUserByPrivyId(privyUser.id)
        
        // If user doesn't exist, create them
        if (!dbUser) {
          const email = privyUser.email?.address || undefined
          dbUser = await createUser(privyUser.id, email)
        }

        setUser(dbUser)
      } catch (err) {
        console.error('Error loading user:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [authenticated, privyUser?.id, privyUser?.email?.address])

  return {
    user,
    loading,
    error,
    authenticated,
    privyUser,
  }
} 