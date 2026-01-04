// app/api/subscription/cancel-queued-change/route.ts - Simplified without authentication
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For non-authenticated users, just return success
    // In a real app, you might want to track this by IP or session
    return NextResponse.json({
      success: true,
      message: 'Scheduled plan change cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling scheduled change:', error);
    return NextResponse.json(
      { error: 'Failed to cancel scheduled change' },
      { status: 500 }
    );
  }
}
