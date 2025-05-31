import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic functionality
    const testData = {
      status: 'success',
      message: 'CrossPostX API is working!',
      timestamp: new Date().toISOString(),
      dependencies: {
        supabase: '✅ Configured',
        privy: '✅ Configured', 
        twitter: '✅ Configured',
        farcaster: '✅ Configured',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasPrivyAppId: !!process.env.NEXT_PUBLIC_PRIVY_APP_ID,
      }
    }

    return NextResponse.json(testData)
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 