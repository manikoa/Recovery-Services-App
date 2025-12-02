/**
 * Resources API Route
 * 
 * Proxies requests to the Python backend API.
 * The backend handles all Google Sheets connections.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - defaults to localhost:8001
// Can be overridden with BACKEND_API_URL environment variable
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8001';

export async function GET(request: NextRequest) {
  try {
    // Forward query parameters to backend
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${BACKEND_API_URL}/api/resources${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch resources', message: errorData.detail || errorData.error },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Backend server is not running', message: `Cannot connect to ${BACKEND_API_URL}. Please start the backend server.` },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch resources', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_API_URL}/api/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to create resource', message: errorData.detail || errorData.error },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource', message: error.message },
      { status: 500 }
    );
  }
}














