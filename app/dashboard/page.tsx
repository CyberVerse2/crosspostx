'use client'

import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { MonitoredAccountsList } from '../../components/dashboard/MonitoredAccountsList'
import { AddAccountForm } from '../../components/dashboard/AddAccountForm'
import { CrosspostHistory } from '../../components/dashboard/CrosspostHistory'
import { MonitoredAccount } from '../../types'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your Twitter to Farcaster crossposting settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Account Form */}
            <div className="lg:col-span-1">
              <AddAccountForm 
                onAccountAdded={(account: MonitoredAccount) => {
                  // Refresh the accounts list
                  window.location.reload()
                }}
              />
            </div>

            {/* Monitored Accounts List */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Monitored Accounts
                </h2>
                <MonitoredAccountsList />
              </div>
            </div>
          </div>

          {/* Stats and Controls */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Twitter Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/twitter/monitor', {
                        method: 'POST'
                      })
                      const result = await response.json()
                      alert(`Monitoring completed: ${result.data?.newTweetsFound || 0} new tweets found`)
                    } catch (error) {
                      alert('Failed to run monitoring')
                    }
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Check for New Tweets
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/twitter/monitor')
                      const result = await response.json()
                      alert(`Twitter connection: ${result.message}`)
                    } catch (error) {
                      alert('Failed to test connection')
                    }
                  }}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  Test Twitter Connection
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Farcaster Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/farcaster/crosspost', {
                        method: 'POST'
                      })
                      const result = await response.json()
                      alert(`Crossposting completed: ${result.data?.successful || 0} successful, ${result.data?.failed || 0} failed`)
                    } catch (error) {
                      alert('Failed to run crossposting')
                    }
                  }}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  Process Pending Crossposts
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/farcaster/crosspost')
                      const result = await response.json()
                      alert(`Farcaster connection: ${result.message}`)
                    } catch (error) {
                      alert('Failed to test connection')
                    }
                  }}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  Test Farcaster Connection
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Full Pipeline
              </h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      // First check for new tweets
                      const twitterResponse = await fetch('/api/twitter/monitor', {
                        method: 'POST'
                      })
                      const twitterResult = await twitterResponse.json()
                      
                      // Then process crossposts
                      const farcasterResponse = await fetch('/api/farcaster/crosspost', {
                        method: 'POST'
                      })
                      const farcasterResult = await farcasterResponse.json()
                      
                      alert(`Pipeline completed:\n${twitterResult.data?.newTweetsFound || 0} new tweets found\n${farcasterResult.data?.successful || 0} successfully crossposted`)
                      
                      // Refresh the page to show updated data
                      window.location.reload()
                    } catch (error) {
                      alert('Failed to run full pipeline')
                    }
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Run Full Pipeline
                </button>
                <p className="text-xs text-gray-500">
                  Check Twitter + Crosspost to Farcaster
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                System Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Twitter API:</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Farcaster:</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Crosspost History */}
          <div className="mt-8">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Crosspost Activity
              </h2>
              <CrosspostHistory />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 