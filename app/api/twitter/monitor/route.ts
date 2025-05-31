import { NextRequest, NextResponse } from 'next/server'
import { monitorTwitterAccounts, testTwitterConnection } from '../../../../lib/twitter/monitoring'

export async function POST(request: NextRequest) {
  try {
    console.log('Manual Twitter monitoring triggered')
    
    // Run the monitoring process
    const result = await monitorTwitterAccounts()
    
    return NextResponse.json({
      success: true,
      message: 'Twitter monitoring completed',
      data: result
    })
  } catch (error) {
    console.error('Error in Twitter monitoring:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Twitter monitoring failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Twitter connection')
    
    // Test the Twitter connection
    const result = await testTwitterConnection()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing Twitter connection:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to test Twitter connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 