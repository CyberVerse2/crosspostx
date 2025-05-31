import { Scraper } from 'agent-twitter-client'

let twitterClient: Scraper | null = null

export async function getTwitterClient(): Promise<Scraper> {
  if (!twitterClient) {
    twitterClient = new Scraper()
    
    // Login with credentials from environment
    const username = process.env.TWITTER_USERNAME
    const password = process.env.TWITTER_PASSWORD
    const email = process.env.TWITTER_EMAIL
    
    if (!username || !password) {
      throw new Error('Twitter credentials not configured')
    }
    
    try {
      await twitterClient.login(username, password, email)
      console.log('Twitter client logged in successfully')
    } catch (error) {
      console.error('Failed to login to Twitter:', error)
      throw error
    }
  }
  
  return twitterClient
}

export async function getLatestTweets(username: string, count: number = 10) {
  const client = await getTwitterClient()
  
  try {
    const tweets = []
    const tweetIterator = client.getTweets(username, count)
    
    for await (const tweet of tweetIterator) {
      tweets.push(tweet)
      if (tweets.length >= count) break
    }
    
    return tweets
  } catch (error) {
    console.error(`Failed to fetch tweets for ${username}:`, error)
    throw error
  }
}

export async function getTweetById(tweetId: string) {
  const client = await getTwitterClient()
  
  try {
    return await client.getTweet(tweetId)
  } catch (error) {
    console.error(`Failed to fetch tweet ${tweetId}:`, error)
    throw error
  }
} 