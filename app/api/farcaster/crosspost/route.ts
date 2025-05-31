import { NextRequest, NextResponse } from 'next/server'
import { processPendingCrossposts, testFarcasterConnection } from '../../../../lib/farcaster/crosspost'

export async function POST(request: NextRequest) {
  try {
    console.log('Manual Farcaster crossposting triggered')
    
    // Process all pending crossposts
    const result = await processPendingCrossposts()
    
    return NextResponse.json({
      success: true,
      message: 'Farcaster crossposting completed',
      data: result
    })
  } catch (error) {
    console.error('Error in Farcaster crossposting:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Farcaster crossposting failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Farcaster connection')
    
    // Test the Farcaster connection
    const result = await testFarcasterConnection()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing Farcaster connection:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to test Farcaster connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 