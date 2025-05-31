import { FarcasterCastResult } from './client'
import { getPendingCrossposts, updateCrosspostLog } from '../supabase/database'
import { CrosspostLog } from '../../types'

export interface FarcasterCrosspostResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
}

// This function now requires a publishCast function to be passed in
// since we can't use React hooks directly in this service
export async function processPendingCrossposts(
  publishCastFn: (text: string) => Promise<FarcasterCastResult>
): Promise<FarcasterCrosspostResult> {
  const result: FarcasterCrosspostResult = {
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  }

  try {
    // Get all pending crossposts
    const pendingCrossposts = await getPendingCrossposts()
    console.log(`Processing ${pendingCrossposts.length} pending crossposts`)

    for (const crosspost of pendingCrossposts) {
      try {
        await processSingleCrosspost(crosspost, result, publishCastFn)
        result.processed++
      } catch (error) {
        const errorMsg = `Error processing crosspost ${crosspost.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(errorMsg)
        result.errors.push(errorMsg)
        result.failed++
        result.processed++

        // Update the crosspost log with error status
        await updateCrosspostLog(crosspost.id, {
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          processed_at: new Date().toISOString()
        })
      }
    }

    console.log('Crosspost processing completed:', result)
    return result
  } catch (error) {
    const errorMsg = `Failed to get pending crossposts: ${error instanceof Error ? error.message : 'Unknown error'}`
    console.error(errorMsg)
    result.errors.push(errorMsg)
    return result
  }
}

async function processSingleCrosspost(
  crosspost: CrosspostLog, 
  result: FarcasterCrosspostResult,
  publishCastFn: (text: string) => Promise<FarcasterCastResult>
): Promise<void> {
  console.log(`Processing crosspost for tweet: ${crosspost.tweet_id}`)

  try {
    // Format the tweet content for Farcaster
    const castText = formatTweetForFarcaster(crosspost.tweet_text, crosspost.tweet_url)

    // Publish to Farcaster using the provided function
    const castResult = await publishCastFn(castText)

    if (castResult.success && castResult.hash) {
      // Update crosspost log with success
      await updateCrosspostLog(crosspost.id, {
        status: 'completed',
        farcaster_hash: castResult.hash,
        processed_at: new Date().toISOString()
      })

      result.successful++
      console.log(`Successfully crossposted tweet ${crosspost.tweet_id} to Farcaster: ${castResult.hash}`)
    } else {
      throw new Error(castResult.error || 'Failed to publish cast')
    }
  } catch (error) {
    console.error(`Failed to crosspost tweet ${crosspost.tweet_id}:`, error)
    throw error
  }
}

function formatTweetForFarcaster(tweetText: string, tweetUrl: string): string {
  // Clean up the tweet text for Farcaster
  let castText = tweetText.trim()

  // Remove Twitter-specific formatting that doesn't work on Farcaster
  // Remove t.co links (they'll be replaced with the original tweet URL)
  castText = castText.replace(/https:\/\/t\.co\/\w+/g, '').trim()

  // Ensure the cast fits within Farcaster's character limit (320 characters)
  const maxLength = 280 // Leave some room for the source attribution
  
  if (castText.length > maxLength) {
    castText = castText.substring(0, maxLength - 3) + '...'
  }

  // Add source attribution
  const attribution = `\n\nOriginally posted on Twitter: ${tweetUrl}`
  
  // Check if we can fit the attribution
  if ((castText + attribution).length <= 320) {
    castText += attribution
  } else {
    // If not, just add a shorter attribution
    const shortAttribution = `\n\n🐦 ${tweetUrl}`
    if ((castText + shortAttribution).length <= 320) {
      castText += shortAttribution
    }
  }

  return castText
}

export async function testFarcasterConnection(
  publishCastFn: (text: string) => Promise<FarcasterCastResult>
): Promise<{ success: boolean; message: string }> {
  try {
    // Try to publish a test cast
    const testText = `Test cast from CrossPostX - ${new Date().toISOString()}`
    const result = await publishCastFn(testText)
    
    if (result.success) {
      return {
        success: true,
        message: `Farcaster connection successful. Test cast hash: ${result.hash}`
      }
    } else {
      return {
        success: false,
        message: `Farcaster connection failed: ${result.error}`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Farcaster connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function crosspostSingleTweet(
  tweetId: string, 
  tweetText: string, 
  tweetUrl: string,
  publishCastFn: (text: string) => Promise<FarcasterCastResult>
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const castText = formatTweetForFarcaster(tweetText, tweetUrl)
    const result = await publishCastFn(castText)
    
    if (result.success && result.hash) {
      console.log(`Successfully crossposted tweet ${tweetId} to Farcaster: ${result.hash}`)
      return {
        success: true,
        hash: result.hash
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to publish cast'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 