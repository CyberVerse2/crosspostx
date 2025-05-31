'use client'

import { useState, useEffect } from 'react'
import { useUser } from '../../hooks/useUser'
import { CrosspostLog } from '../../types'
import { getCrosspostLogs } from '../../lib/supabase/database'

export function CrosspostHistory() {
  const { user } = useUser()
  const [crossposts, setCrossposts] = useState<CrosspostLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCrossposts() {
      if (!user?.id) return

      try {
        setLoading(true)
        const data = await getCrosspostLogs(user.id, 20) // Get last 20 crossposts
        setCrossposts(data)
      } catch (err) {
        console.error('Error loading crosspost history:', err)
        setError(err instanceof Error ? err.message : 'Failed to load crosspost history')
      } finally {
        setLoading(false)
      }
    }

    loadCrossposts()
  }, [user?.id])

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

  if (crossposts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-2">No crosspost history yet.</p>
        <p className="text-sm text-gray-500">
          Add some Twitter accounts to start crossposting tweets to Farcaster.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {crossposts.map((crosspost) => (
        <div key={crosspost.id} className="bg-white border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  crosspost.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : crosspost.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {crosspost.status === 'completed' ? '✅ Completed' : 
                   crosspost.status === 'failed' ? '❌ Failed' : 
                   '⏳ Pending'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(crosspost.created_at).toLocaleDateString()} at{' '}
                  {new Date(crosspost.created_at).toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-gray-900 mb-2 line-clamp-3">
                {crosspost.tweet_text}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <a 
                  href={crosspost.tweet_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Tweet →
                </a>
                
                {crosspost.farcaster_hash && (
                  <a 
                    href={`https://warpcast.com/~/conversations/${crosspost.farcaster_hash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    View Cast →
                  </a>
                )}
                
                <span>Tweet ID: {crosspost.tweet_id}</span>
              </div>
              
              {crosspost.error_message && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  <strong>Error:</strong> {crosspost.error_message}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 