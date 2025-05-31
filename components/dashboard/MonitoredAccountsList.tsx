'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { useUser } from '../../hooks/useUser'
import { MonitoredAccount } from '../../types'
import { getMonitoredAccounts, deleteMonitoredAccount } from '../../lib/supabase/database'

export function MonitoredAccountsList() {
  const { user } = useUser()
  const [accounts, setAccounts] = useState<MonitoredAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAccounts() {
      if (!user?.id) return

      try {
        setLoading(true)
        const data = await getMonitoredAccounts(user.id)
        setAccounts(data)
      } catch (err) {
        console.error('Error loading monitored accounts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [user?.id])

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to stop monitoring this account?')) {
      return
    }

    try {
      await deleteMonitoredAccount(accountId)
      setAccounts(accounts.filter(account => account.id !== accountId))
    } catch (err) {
      console.error('Error deleting account:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No Twitter accounts being monitored yet.</p>
        <p className="text-sm text-gray-500">Add an account to start crossposting tweets to Farcaster.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {account.twitter_username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">@{account.twitter_username}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  account.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.is_active ? 'Active' : 'Inactive'}
                </span>
                {account.last_checked_at && (
                  <span>
                    Last checked: {new Date(account.last_checked_at).toLocaleDateString()}
                  </span>
                )}
                {account.last_tweet_id && (
                  <span>
                    Last tweet: {account.last_tweet_id.substring(0, 8)}...
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteAccount(account.id)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
} 