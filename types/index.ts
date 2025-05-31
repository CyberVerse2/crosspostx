export interface User {
  id: string
  email?: string
  twitter_username?: string
  farcaster_fid?: number
  created_at: string
  updated_at: string
}

export interface MonitoredAccount {
  id: string
  user_id: string
  twitter_username: string
  is_active: boolean
  last_checked_at?: string
  last_tweet_id?: string
  created_at: string
  updated_at: string
}

export interface CrosspostLog {
  id: string
  user_id: string
  monitored_account_id: string
  tweet_id: string
  tweet_text: string
  tweet_url: string
  farcaster_cast_hash?: string
  status: 'pending' | 'success' | 'failed' | 'skipped'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface Tweet {
  id: string
  text: string
  username: string
  name: string
  timestamp: Date
  url: string
  isRetweet: boolean
  isReply: boolean
  photos?: string[]
  videos?: string[]
  hashtags?: string[]
  mentions?: string[]
}

export interface FarcasterCast {
  hash: string
  text: string
  embeds?: string[]
  timestamp: Date
  author: {
    fid: number
    username: string
  }
}

export interface CrosspostSettings {
  id: string
  user_id: string
  skip_retweets: boolean
  skip_replies: boolean
  include_media: boolean
  add_source_link: boolean
  custom_prefix?: string
  custom_suffix?: string
  created_at: string
  updated_at: string
}

export interface MonitoringJob {
  id: string
  monitored_account_id: string
  status: 'running' | 'completed' | 'failed'
  tweets_found: number
  tweets_crossposted: number
  started_at: string
  completed_at?: string
  error_message?: string
} 