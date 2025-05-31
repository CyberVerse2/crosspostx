import { supabase, supabaseAdmin } from './client'
import { User, MonitoredAccount, CrosspostLog, CrosspostSettings } from '../../types'

// User operations
export async function createUser(privyUserId: string, email?: string): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      privy_user_id: privyUserId,
      email,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserByPrivyId(privyUserId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('privy_user_id', privyUserId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Monitored accounts operations
export async function createMonitoredAccount(
  userId: string,
  twitterUsername: string
): Promise<MonitoredAccount> {
  const { data, error } = await supabase
    .from('monitored_accounts')
    .insert({
      user_id: userId,
      twitter_username: twitterUsername,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMonitoredAccounts(userId: string): Promise<MonitoredAccount[]> {
  const { data, error } = await supabase
    .from('monitored_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateMonitoredAccount(
  accountId: string,
  updates: Partial<MonitoredAccount>
): Promise<MonitoredAccount> {
  const { data, error } = await supabase
    .from('monitored_accounts')
    .update(updates)
    .eq('id', accountId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMonitoredAccount(accountId: string): Promise<void> {
  const { error } = await supabase
    .from('monitored_accounts')
    .delete()
    .eq('id', accountId)

  if (error) throw error
}

// Crosspost logs operations
export async function createCrosspostLog(
  userId: string,
  monitoredAccountId: string,
  tweetId: string,
  tweetText: string,
  tweetUrl: string
): Promise<CrosspostLog> {
  const { data, error } = await supabase
    .from('crosspost_logs')
    .insert({
      user_id: userId,
      monitored_account_id: monitoredAccountId,
      tweet_id: tweetId,
      tweet_text: tweetText,
      tweet_url: tweetUrl,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCrosspostLog(
  logId: string,
  updates: Partial<CrosspostLog>
): Promise<CrosspostLog> {
  const { data, error } = await supabase
    .from('crosspost_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCrosspostLogs(
  userId: string,
  limit: number = 50
): Promise<CrosspostLog[]> {
  const { data, error } = await supabase
    .from('crosspost_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Crosspost settings operations
export async function getCrosspostSettings(userId: string): Promise<CrosspostSettings | null> {
  const { data, error } = await supabase
    .from('crosspost_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createOrUpdateCrosspostSettings(
  userId: string,
  settings: Partial<CrosspostSettings>
): Promise<CrosspostSettings> {
  const { data, error } = await supabase
    .from('crosspost_settings')
    .upsert({
      user_id: userId,
      ...settings,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get active monitored accounts for background processing
export async function getActiveMonitoredAccounts(): Promise<MonitoredAccount[]> {
  const { data, error } = await supabaseAdmin
    .from('monitored_accounts')
    .select('*')
    .eq('is_active', true)

  if (error) throw error
  return data || []
}

// Check if tweet has already been crossposted
export async function isTweetCrossposted(tweetId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('crosspost_logs')
    .select('id')
    .eq('tweet_id', tweetId)
    .limit(1)

  if (error) throw error
  return (data?.length || 0) > 0
} 