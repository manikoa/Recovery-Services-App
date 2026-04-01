/**
 * Single Resource API Route
 * 
 * Handles GET and PATCH requests for a single resource by slug or ID using Google Sheets.
 * Supports both slug-based lookup (GET) and ID-based updates (PATCH).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResourceBySlug, updateResource } from '@/lib/google-sheets/resources';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Check if slug is numeric (ID) or string (slug)
    const resourceId = parseInt(slug, 10);
    let resource;
    
    if (!isNaN(resourceId)) {
      // If it's a number, we need to get all resources and find by ID
      // For now, we'll use slug lookup - you can enhance this later
      const { getResources } = await import('@/lib/google-sheets/resources');
      const resources = await getResources({ status: undefined });
      resource = resources.find(r => r.id === resourceId) || null;
    } else {
      resource = await getResourceBySlug(slug);
    }
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: resource }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    // Check if slug is numeric (ID) or string (slug)
    const resourceId = parseInt(slug, 10);
    
    if (isNaN(resourceId)) {
      // If it's a slug, get the resource first to find its ID
      const resource = await getResourceBySlug(slug);
      if (!resource) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      const success = await updateResource(resource.id, body);
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update resource' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // It's an ID
      const success = await updateResource(resourceId, body);
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to update resource' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource', message: error.message },
      { status: 500 }
    );
  }
}

