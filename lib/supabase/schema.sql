-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  twitter_username TEXT,
  farcaster_fid INTEGER,
  privy_user_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitored Twitter accounts
CREATE TABLE monitored_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  twitter_username TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_tweet_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, twitter_username)
);

-- Crosspost logs
CREATE TABLE crosspost_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monitored_account_id UUID REFERENCES monitored_accounts(id) ON DELETE CASCADE,
  tweet_id TEXT NOT NULL,
  tweet_text TEXT NOT NULL,
  tweet_url TEXT NOT NULL,
  farcaster_cast_hash TEXT,
  status TEXT CHECK (status IN ('pending', 'success', 'failed', 'skipped')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crosspost settings
CREATE TABLE crosspost_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  skip_retweets BOOLEAN DEFAULT true,
  skip_replies BOOLEAN DEFAULT true,
  include_media BOOLEAN DEFAULT true,
  add_source_link BOOLEAN DEFAULT true,
  custom_prefix TEXT,
  custom_suffix TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring jobs
CREATE TABLE monitoring_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  monitored_account_id UUID REFERENCES monitored_accounts(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  tweets_found INTEGER DEFAULT 0,
  tweets_crossposted INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Indexes for better performance
CREATE INDEX idx_monitored_accounts_user_id ON monitored_accounts(user_id);
CREATE INDEX idx_monitored_accounts_active ON monitored_accounts(is_active);
CREATE INDEX idx_crosspost_logs_user_id ON crosspost_logs(user_id);
CREATE INDEX idx_crosspost_logs_status ON crosspost_logs(status);
CREATE INDEX idx_crosspost_logs_created_at ON crosspost_logs(created_at);
CREATE INDEX idx_monitoring_jobs_status ON monitoring_jobs(status);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crosspost_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crosspost_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = privy_user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = privy_user_id);

-- Monitored accounts policies
CREATE POLICY "Users can view own monitored accounts" ON monitored_accounts FOR SELECT USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));
CREATE POLICY "Users can insert own monitored accounts" ON monitored_accounts FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));
CREATE POLICY "Users can update own monitored accounts" ON monitored_accounts FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));
CREATE POLICY "Users can delete own monitored accounts" ON monitored_accounts FOR DELETE USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));

-- Crosspost logs policies
CREATE POLICY "Users can view own crosspost logs" ON crosspost_logs FOR SELECT USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));

-- Crosspost settings policies
CREATE POLICY "Users can view own settings" ON crosspost_settings FOR SELECT USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));
CREATE POLICY "Users can insert own settings" ON crosspost_settings FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));
CREATE POLICY "Users can update own settings" ON crosspost_settings FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE privy_user_id = auth.uid()::text));

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitored_accounts_updated_at BEFORE UPDATE ON monitored_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crosspost_logs_updated_at BEFORE UPDATE ON crosspost_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crosspost_settings_updated_at BEFORE UPDATE ON crosspost_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 