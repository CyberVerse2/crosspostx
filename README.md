# CrossPostX - Twitter to Farcaster Crossposting App

A Next.js application that automatically monitors Twitter accounts and crossposts tweets to Farcaster.

## Features

- 🔐 **Secure Authentication** - Privy integration for Twitter and Farcaster login
- 📊 **Real-time Monitoring** - Automatic monitoring of Twitter accounts for new posts
- 🚀 **Auto Crossposting** - Seamless crossposting from Twitter to Farcaster
- 💾 **Database Storage** - Supabase for reliable data storage and user management
- 📱 **Modern UI** - Clean, responsive interface built with Next.js and Tailwind CSS
- ⚙️ **Customizable Settings** - Control what gets crossposted and how

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: Privy (Twitter & Farcaster)
- **Database**: Supabase (PostgreSQL)
- **Twitter Integration**: elizaOS/agent-twitter-client
- **Farcaster Integration**: @farcaster/hub-nodejs
- **Deployment**: Vercel (recommended)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Privy account and app
- Twitter account for monitoring
- Farcaster account for posting

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd crosspostx
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your environment variables in `.env.local`:**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Privy Configuration
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   PRIVY_APP_SECRET=your_privy_app_secret

   # Twitter Configuration (for monitoring)
   TWITTER_USERNAME=your_twitter_username
   TWITTER_PASSWORD=your_twitter_password
   TWITTER_EMAIL=your_twitter_email

   # Farcaster Configuration
   FARCASTER_MNEMONIC=your_farcaster_mnemonic
   FARCASTER_FID=your_farcaster_fid

   # Application Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up your Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL schema from `lib/supabase/schema.sql`

5. **Configure Privy**
   - Create a Privy app at [privy.io](https://privy.io)
   - Enable Twitter and Farcaster login methods
   - Add your domain to allowed origins

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Test the setup**
   ```bash
   curl http://localhost:3000/api/test
   ```

## Configuration Guide

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and keys
3. Run the database schema from `lib/supabase/schema.sql`
4. Configure Row Level Security policies

### Privy Setup

1. Create an app at [privy.io](https://privy.io)
2. Configure login methods:
   - Enable Twitter OAuth
   - Enable Farcaster (if available)
3. Set up your app domain and redirect URLs
4. Get your App ID and App Secret

### Twitter Configuration

The app uses the elizaOS/agent-twitter-client library which requires:
- A Twitter account username and password
- Email associated with the account
- These credentials are used for monitoring only

### Farcaster Configuration

For Farcaster posting, you need:
- A Farcaster account with FID (Farcaster ID)
- A mnemonic phrase for signing transactions
- Access to a Farcaster hub for posting

## Project Structure

```
crosspostx/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (pages)/           # App pages
├── lib/                   # Core libraries
│   ├── supabase/         # Database client and operations
│   ├── privy/            # Authentication configuration
│   ├── twitter/          # Twitter client and monitoring
│   └── farcaster/        # Farcaster client and posting
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Authentication components
│   └── dashboard/       # Dashboard components
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

## Development Status

### ✅ Completed
- [x] Project setup and dependencies
- [x] Database schema design
- [x] Core configuration files
- [x] TypeScript type definitions
- [x] Basic API structure

### 🚧 In Progress
- [ ] Authentication integration
- [ ] Twitter monitoring implementation
- [ ] Farcaster posting functionality
- [ ] User interface development

### 📋 Planned
- [ ] Background job processing
- [ ] Error handling and retry logic
- [ ] Analytics and reporting
- [ ] Deployment configuration

## API Endpoints

- `GET /api/test` - Health check and configuration test
- `POST /api/auth/login` - User authentication (planned)
- `GET /api/monitored-accounts` - Get user's monitored accounts (planned)
- `POST /api/monitored-accounts` - Add new monitored account (planned)
- `GET /api/crosspost-logs` - Get crosspost history (planned)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the setup guide

---

**Note**: This is an active development project. Some features may not be fully implemented yet. Check the development status above for current progress.
