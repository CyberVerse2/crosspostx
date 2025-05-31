import { NextRequest, NextResponse } from 'next/server'
import { processPendingCrossposts, testFarcasterConnection } from '../../../../lib/farcaster/crosspost'

export async function POST(request: NextRequest) {
  try {
    // For now, return an error since this endpoint requires React hooks
    // This functionality should be moved to client-side components
    return NextResponse.json(
      { 
        success: false, 
        error: 'Farcaster crossposting must be done from the client-side with authenticated user' 
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Farcaster crosspost error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // For now, return an error since this endpoint requires React hooks
    // This functionality should be moved to client-side components
    return NextResponse.json(
      { 
        success: false, 
        error: 'Farcaster connection testing must be done from the client-side with authenticated user' 
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Farcaster connection test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 