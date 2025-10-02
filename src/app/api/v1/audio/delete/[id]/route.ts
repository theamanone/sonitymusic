// app/api/v1/audio/delete/[id]/route.ts - Delete Audio File API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';

async function deleteHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const confirmDelete = searchParams.get('confirm') === 'true';

    if (!confirmDelete) {
      return NextResponse.json(
        { error: 'Deletion must be confirmed with confirm=true parameter' },
        { status: 400 }
      );
    }

    // Check if file exists and get metadata
    const audioData = await privateStorage.getAudioFile(id);
    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      );
    }

    // Delete the file
    const deleted = await privateStorage.deleteStoredFile(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete audio file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Audio file deleted successfully',
      data: {
        id,
        title: audioData.metadata.metadata?.title,
        deletedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete operation failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRateLimit(
    RATE_LIMIT_RULES.API_GENERAL,
    () => deleteHandler(request, { params })
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
