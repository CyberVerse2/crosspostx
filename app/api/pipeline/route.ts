import { NextRequest, NextResponse } from 'next/server'
import { runCrosspostPipeline, getSystemHealth } from '../../../lib/services/crosspostService'

export async function POST(request: NextRequest) {
  try {
    console.log('Full crosspost pipeline triggered')
    
    // Run the complete pipeline
    const result = await runCrosspostPipeline()
    
    return NextResponse.json({
      success: true,
      message: 'Crosspost pipeline completed successfully',
      data: result
    })
  } catch (error) {
    console.error('Error in crosspost pipeline:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Crosspost pipeline failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('System health check requested')
    
    // Get system health status
    const health = await getSystemHealth()
    
    const allConnected = Object.values(health).every(service => service.status === 'connected')
    
    return NextResponse.json({
      success: allConnected,
      message: allConnected ? 'All systems operational' : 'Some systems have issues',
      data: health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error checking system health:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to check system health',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 