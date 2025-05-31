import { monitorTwitterAccounts, TwitterMonitoringResult } from '../twitter/monitoring'
import { processPendingCrossposts, FarcasterCrosspostResult } from '../farcaster/crosspost'

export interface CrosspostPipelineResult {
  twitter: TwitterMonitoringResult
  farcaster: FarcasterCrosspostResult
  summary: {
    totalAccountsChecked: number
    newTweetsFound: number
    successfulCrossposts: number
    failedCrossposts: number
    errors: string[]
  }
}

export async function runCrosspostPipeline(): Promise<CrosspostPipelineResult> {
  console.log('Starting crosspost pipeline...')
  
  // Step 1: Monitor Twitter accounts for new tweets
  console.log('Step 1: Monitoring Twitter accounts...')
  const twitterResult = await monitorTwitterAccounts()
  
  // Step 2: Process pending crossposts to Farcaster
  console.log('Step 2: Processing Farcaster crossposts...')
  const farcasterResult = await processPendingCrossposts()
  
  // Compile summary
  const summary = {
    totalAccountsChecked: twitterResult.accountsChecked,
    newTweetsFound: twitterResult.newTweetsFound,
    successfulCrossposts: farcasterResult.successful,
    failedCrossposts: farcasterResult.failed,
    errors: [...twitterResult.errors, ...farcasterResult.errors]
  }
  
  const result: CrosspostPipelineResult = {
    twitter: twitterResult,
    farcaster: farcasterResult,
    summary
  }
  
  console.log('Crosspost pipeline completed:', summary)
  
  return result
}

export async function getSystemHealth(): Promise<{
  twitter: { status: 'connected' | 'error'; message: string }
  farcaster: { status: 'connected' | 'error'; message: string }
  database: { status: 'connected' | 'error'; message: string }
}> {
  const health = {
    twitter: { status: 'error' as const, message: 'Not tested' },
    farcaster: { status: 'error' as const, message: 'Not tested' },
    database: { status: 'error' as const, message: 'Not tested' }
  }
  
  // Test Twitter connection
  try {
    const { testTwitterConnection } = await import('../twitter/monitoring')
    const twitterTest = await testTwitterConnection()
    health.twitter = {
      status: twitterTest.success ? 'connected' : 'error',
      message: twitterTest.message
    }
  } catch (error) {
    health.twitter = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  // Test Farcaster connection
  try {
    const { testFarcasterConnection } = await import('../farcaster/crosspost')
    const farcasterTest = await testFarcasterConnection()
    health.farcaster = {
      status: farcasterTest.success ? 'connected' : 'error',
      message: farcasterTest.message
    }
  } catch (error) {
    health.farcaster = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  // Test database connection
  try {
    const { supabase } = await import('../supabase/client')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      health.database = {
        status: 'error',
        message: error.message
      }
    } else {
      health.database = {
        status: 'connected',
        message: 'Database connection successful'
      }
    }
  } catch (error) {
    health.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  return health
} 