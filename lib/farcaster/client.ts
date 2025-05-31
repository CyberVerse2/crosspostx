import { NobleEd25519Signer } from '@farcaster/hub-nodejs'
import { mnemonicToAccount } from 'viem/accounts'

export interface FarcasterCastData {
  text: string
  embeds?: string[]
  mentions?: number[]
  mentionsPositions?: number[]
}

export class FarcasterClient {
  private signer: NobleEd25519Signer | null = null
  private fid: number

  constructor(fid: number) {
    this.fid = fid
  }

  async initialize(mnemonic: string) {
    try {
      // Create account from mnemonic
      const account = mnemonicToAccount(mnemonic)
      
      // Create signer from private key
      this.signer = new NobleEd25519Signer(account.getHdKey().privateKey!)
      
      console.log('Farcaster client initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Farcaster client:', error)
      throw error
    }
  }

  async publishCast(castData: FarcasterCastData): Promise<string> {
    if (!this.signer) {
      throw new Error('Farcaster client not initialized')
    }

    try {
      // This is a simplified implementation
      // In a real implementation, you would use the Farcaster Hub API
      // to submit the cast message
      
      console.log('Publishing cast to Farcaster:', castData)
      
      // TODO: Implement actual Farcaster Hub API call
      // For now, we'll simulate a successful cast
      const castHash = `0x${Math.random().toString(16).substring(2, 18)}`
      
      return castHash
    } catch (error) {
      console.error('Failed to publish cast:', error)
      throw error
    }
  }

  async formatTweetForFarcaster(tweetText: string, tweetUrl?: string): Promise<FarcasterCastData> {
    // Format tweet content for Farcaster
    let text = tweetText
    
    // Farcaster has a 320 character limit
    if (text.length > 280) {
      text = text.substring(0, 277) + '...'
    }
    
    const embeds = tweetUrl ? [tweetUrl] : []
    
    return {
      text,
      embeds,
    }
  }
}

export async function createFarcasterClient(): Promise<FarcasterClient> {
  const fid = parseInt(process.env.FARCASTER_FID || '0')
  const mnemonic = process.env.FARCASTER_MNEMONIC
  
  if (!fid || !mnemonic) {
    throw new Error('Farcaster configuration not found')
  }
  
  const client = new FarcasterClient(fid)
  await client.initialize(mnemonic)
  
  return client
} 