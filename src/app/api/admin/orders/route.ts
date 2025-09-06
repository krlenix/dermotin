import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const country = searchParams.get('country') || undefined;
    const status = searchParams.get('status') || undefined;
    const locale = searchParams.get('locale') || undefined;
    const domain = searchParams.get('domain') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100.' 
        },
        { status: 400 }
      );
    }

    console.log('📊 Fetching orders from Supabase:', { page, limit, country, status, locale, domain, dateFrom, dateTo });

    // Fetch orders from Supabase
    const result = await OrderService.getOrders(page, limit, {
      country,
      status,
      locale,
      domain,
      dateFrom,
      dateTo
    });

    if (!result.success) {
      console.error('❌ Failed to fetch orders:', result.error);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }

    console.log('✅ Successfully fetched orders:', result.data?.length, 'orders');

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.count || 0,
        totalPages: Math.ceil((result.count || 0) / limit)
      },
      filters: {
        country,
        status,
        locale,
        domain,
        dateFrom,
        dateTo
      }
    });

  } catch (error) {
    console.error('❌ Admin orders API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get single order by ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, status } = body;

    if (!orderId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order ID is required' 
        },
        { status: 400 }
      );
    }

    if (action === 'get') {
      // Get single order
      const result = await OrderService.getOrderById(orderId);
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data
      });

    } else if (action === 'updateStatus' && status) {
      // Update order status
      const result = await OrderService.updateOrderStatus(orderId, status);
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error 
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        message: `Order status updated to ${status}`
      });

    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid action or missing parameters' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Admin orders POST API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
