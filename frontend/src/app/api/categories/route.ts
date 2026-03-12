/**
 * Categories API Route
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
    const response = await fetch(`${BACKEND_API_URL}/api/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch categories', message: errorData.detail || errorData.error },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', message: error.message },
      { status: 500 }
    );
  }
}














