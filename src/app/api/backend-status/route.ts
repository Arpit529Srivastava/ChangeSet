import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const goBackendUrl = process.env.GO_BACKEND_URL || 'http://localhost:8080'
    
    // Fetch both health and stats in parallel
    const [healthRes, statsRes] = await Promise.allSettled([
      fetch(`${goBackendUrl}/health`),
      fetch(`${goBackendUrl}/stats`)
    ])

    const health = healthRes.status === 'fulfilled' && healthRes.value.ok 
      ? await healthRes.value.json() 
      : null
    
    const stats = statsRes.status === 'fulfilled' && statsRes.value.ok 
      ? await statsRes.value.json() 
      : null

    return NextResponse.json({
      health,
      stats,
      timestamp: new Date().toISOString(),
      backendUrl: goBackendUrl
    })
  } catch (error) {
    console.error('Error fetching backend status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch backend status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 