import { NextRequest, NextResponse } from 'next/server'
import { getUserByPrivyId } from '../../../../lib/supabase/database'

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would verify the Privy JWT token here
    // For now, we'll expect the privy user ID to be passed as a query parameter
    const { searchParams } = new URL(request.url)
    const privyUserId = searchParams.get('privyUserId')

    if (!privyUserId) {
      return NextResponse.json(
        { error: 'Privy user ID is required' },
        { status: 400 }
      )
    }

    const user = await getUserByPrivyId(privyUserId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 