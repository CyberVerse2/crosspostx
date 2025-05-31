'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { useUser } from '../../hooks/useUser'
import { createMonitoredAccount } from '../../lib/supabase/database'
import { MonitoredAccount } from '../../types'

interface AddAccountFormProps {
  onAccountAdded: (account: MonitoredAccount) => void
}

export function AddAccountForm({ onAccountAdded }: AddAccountFormProps) {
  const { user } = useUser()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      setError('User not authenticated')
      return
    }

    if (!username.trim()) {
      setError('Please enter a Twitter username')
      return
    }

    // Clean the username (remove @ if present)
    const cleanUsername = username.replace('@', '').trim()

    try {
      setLoading(true)
      setError(null)

      // Validate username format (basic validation)
      if (!/^[a-zA-Z0-9_]{1,15}$/.test(cleanUsername)) {
        throw new Error('Invalid Twitter username format')
      }

      const newAccount = await createMonitoredAccount(user.id, cleanUsername)
      onAccountAdded(newAccount)
      setUsername('')
    } catch (err) {
      console.error('Error adding account:', err)
      if (err instanceof Error && err.message.includes('duplicate')) {
        setError('This account is already being monitored')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to add account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Twitter Account</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Twitter Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="elonmusk"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the Twitter username without the @ symbol
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Account...
            </div>
          ) : (
            'Add Account'
          )}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Once added, we'll start monitoring this account for new tweets and automatically crosspost them to Farcaster based on your settings.
        </p>
      </div>
    </div>
  )
} 