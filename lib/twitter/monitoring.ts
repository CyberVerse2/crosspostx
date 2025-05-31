import { getTwitterClient, getLatestTweets } from './client'
import { getActiveMonitoredAccounts, updateMonitoredAccount, isTweetCrossposted, createCrosspostLog } from '../supabase/database'
import { MonitoredAccount, Tweet } from '../../types'

export interface TwitterMonitoringResult {
  accountsChecked: number
  newTweetsFound: number
  errors: string[]
}

export async function monitorTwitterAccounts(): Promise<TwitterMonitoringResult> {
  const result: TwitterMonitoringResult = {
    accountsChecked: 0,
    newTweetsFound: 0,
    errors: []
  }

  try {
    // Get all active monitored accounts
    const accounts = await getActiveMonitoredAccounts()
    console.log(`Monitoring ${accounts.length} Twitter accounts`)

    for (const account of accounts) {
      try {
        await monitorSingleAccount(account, result)
        result.accountsChecked++
      } catch (error) {
        const errorMsg = `Error monitoring @${account.twitter_username}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(errorMsg)
        result.errors.push(errorMsg)
      }
    }

    console.log('Monitoring completed:', result)
    return result
  } catch (error) {
    const errorMsg = `Failed to get monitored accounts: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error(errorMsg)
    result.errors.push(errorMsg)
    return result
  }
}

async function monitorSingleAccount(account: MonitoredAccount, result: TwitterMonitoringResult): Promise<void> {
  console.log(`Checking @${account.twitter_username} for new tweets`)

  try {
    // Fetch latest tweets from this account
    const tweets = await getLatestTweets(account.twitter_username, 10)
    
    if (!tweets || tweets.length === 0) {
      console.log(`No tweets found for @${account.twitter_username}`)
      return
    }

    // Process each tweet
    for (const tweet of tweets) {
      try {
        await processTweet(tweet, account, result)
      } catch (error) {
        console.error(`Error processing tweet ${tweet.id}:`, error)
        result.errors.push(`Error processing tweet from @${account.twitter_username}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Update the account's last checked time and last tweet ID
    const latestTweet = tweets[0]
    await updateMonitoredAccount(account.id, {
      last_checked_at: new Date().toISOString(),
      last_tweet_id: latestTweet?.id || account.last_tweet_id
    })

  } catch (error) {
    console.error(`Failed to fetch tweets for @${account.twitter_username}:`, error)
    throw error
  }
}

async function processTweet(tweet: any, account: MonitoredAccount, result: TwitterMonitoringResult): Promise<void> {
  // Skip if we've already processed this tweet
  if (await isTweetCrossposted(tweet.id)) {
    return
  }

  // Skip if this tweet is older than the last processed tweet
  if (account.last_tweet_id && tweet.id <= account.last_tweet_id) {
    return
  }

  console.log(`New tweet found from @${account.twitter_username}: ${tweet.id}`)

  // Convert the tweet to our format
  const formattedTweet: Tweet = {
    id: tweet.id,
    text: tweet.text || '',
    username: account.twitter_username,
    name: tweet.name || account.twitter_username,
    timestamp: new Date(tweet.timestamp || Date.now()),
    url: `https://twitter.com/${account.twitter_username}/status/${tweet.id}`,
    isRetweet: tweet.isRetweet || false,
    isReply: tweet.isReply || false,
    photos: tweet.photos || [],
    videos: tweet.videos || [],
    hashtags: tweet.hashtags || [],
    mentions: tweet.mentions || []
  }

  // Create a crosspost log entry (initially pending)
  await createCrosspostLog(
    account.user_id,
    account.id,
    formattedTweet.id,
    formattedTweet.text,
    formattedTweet.url
  )

  result.newTweetsFound++
  console.log(`Queued tweet ${formattedTweet.id} for crossposting`)
}

export async function testTwitterConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const client = await getTwitterClient()
    
    // Try to fetch tweets from a known account to test the connection
    const tweets = await getLatestTweets('twitter', 1) // Twitter's official account
    
    if (tweets && tweets.length > 0) {
      return {
        success: true,
        message: 'Twitter connection successful'
      }
    } else {
      return {
        success: false,
        message: 'Twitter connection failed: No tweets returned'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Twitter connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
} 