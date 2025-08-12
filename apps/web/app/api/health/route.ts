import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Basic health checks
    const checks = {
      server: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV,
      version: process.version,
    };

    // Check database connectivity (if applicable)
    // const dbHealthy = await checkDatabase();
    // checks.database = dbHealthy;

    // Calculate response time
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      checks,
      responseTime: `${responseTime}ms`,
      service: 'skyscout-ai-web',
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: `${responseTime}ms`,
        service: 'skyscout-ai-web',
      },
      { status: 500 }
    );
  }
}

// Basic liveness probe
export async function HEAD() {
  return new Response(null, { status: 200 });
}
