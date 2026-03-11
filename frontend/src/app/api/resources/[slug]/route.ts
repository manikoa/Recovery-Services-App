/**
 * Single Resource API Route
 * 
 * Proxies requests to the Python backend API for a single resource.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - defaults to localhost:8001
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8001';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;
    const url = `${BACKEND_API_URL}/api/resources/${slug}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch resource', message: errorData.detail || errorData.error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching resource:', error);
    if (error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
      return NextResponse.json(
        { error: 'Backend server is not running', message: `Cannot connect to ${BACKEND_API_URL}` },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch resource', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;
    const body = await request.json();
    const url = `${BACKEND_API_URL}/api/resources/${slug}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to update resource', message: errorData.detail || errorData.error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource', message: error.message },
      { status: 500 }
    );
  }
}

