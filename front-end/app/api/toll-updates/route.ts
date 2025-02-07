import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Send updates every 5 seconds
  const interval = setInterval(async () => {
    const update = {
      timestamp: new Date().toISOString(),
      totalVehicles: Math.floor(Math.random() * 1000),
      totalRevenue: Math.floor(Math.random() * 10000),
    }

    await writer.write(encoder.encode(`data: ${JSON.stringify(update)}\n\n`))
  }, 5000)

  req.signal.addEventListener('abort', () => {
    clearInterval(interval)
    writer.close()
  })

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

