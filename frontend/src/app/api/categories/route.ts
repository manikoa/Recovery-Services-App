/**
 * Categories API Route
 * 
 * Handles GET requests for resource categories using Google Sheets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResourceCategories } from '@/lib/google-sheets/resources';

export async function GET(request: NextRequest) {
  try {
    const categories = await getResourceCategories();
    
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', message: error.message },
      { status: 500 }
    );
  }
}













