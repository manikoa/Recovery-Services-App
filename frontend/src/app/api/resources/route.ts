/**
 * Resources API Route
 * 
 * Handles GET and POST requests for resources using Google Sheets as the backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResources, createResource } from '@/lib/google-sheets/resources';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters: any = {};
    
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category');
    }
    if (searchParams.get('city')) {
      filters.city = searchParams.get('city');
    }
    if (searchParams.get('state')) {
      filters.state = searchParams.get('state');
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    if (searchParams.get('query')) {
      filters.query = searchParams.get('query');
    }
    
    const resources = await getResources(filters);
    
    return NextResponse.json({ data: resources }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const resource = await createResource(body);
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Failed to create resource' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: resource }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource', message: error.message },
      { status: 500 }
    );
  }
}













