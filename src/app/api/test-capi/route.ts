import { NextResponse } from 'next/server';
import { sendCapiPurchaseEvent, sendCapiInitiateCheckoutEvent } from '@/lib/capi';

/**
 * Test endpoint to manually trigger CAPI events
 * Usage: GET /api/test-capi?country=rs&event=purchase
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'rs';
  const eventType = searchParams.get('event') || 'purchase';

  console.log('\n' + '🧪'.repeat(40));
  console.log('🧪 TEST CAPI ENDPOINT CALLED');
  console.log('  Country:', country);
  console.log('  Event Type:', eventType);
  console.log('  ⚠️  WATCH THIS TERMINAL FOR DETAILED CAPI LOGS BELOW!');
  console.log('🧪'.repeat(40));

  try {
    if (eventType === 'purchase') {
      // Test Purchase event
      const result = await sendCapiPurchaseEvent(country, {
        orderId: `TEST-${Date.now()}`,
        currency: country === 'rs' ? 'RSD' : country === 'ba' ? 'BAM' : 'HRK',
        totalPrice: 5990,
        customerEmail: 'test@example.com',
        customerPhone: '+381601234567',
        customerFirstName: 'Test',
        customerLastName: 'User',
        customerCity: 'Belgrade',
        customerZip: '11000',
        customerCountry: country.toUpperCase(),
        clientIp: '192.168.1.1',
        clientUserAgent: request.headers.get('user-agent') || undefined,
        fbp: 'fb.1.1234567890.987654321',
        fbc: undefined,
        eventSourceUrl: request.url,
        eventId: `test-${Date.now()}`,
        lineItems: [
          {
            sku: 'biomelis-3',
            name: 'Test Product',
            quantity: 3,
            price: 1990,
          },
        ],
      });

      return NextResponse.json({
        success: true,
        message: 'Test Purchase event sent',
        result,
      });
    } else if (eventType === 'checkout') {
      // Test InitiateCheckout event
      const result = await sendCapiInitiateCheckoutEvent(country, {
        currency: country === 'rs' ? 'RSD' : country === 'ba' ? 'BAM' : 'HRK',
        value: 5990,
        customerEmail: 'test@example.com',
        customerPhone: '+381601234567',
        clientIp: '192.168.1.1',
        clientUserAgent: request.headers.get('user-agent') || undefined,
        fbp: 'fb.1.1234567890.987654321',
        fbc: undefined,
        eventSourceUrl: request.url,
        contentIds: ['biomelis-3'],
        numItems: 3,
      });

      return NextResponse.json({
        success: true,
        message: 'Test InitiateCheckout event sent',
        result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid event type. Use "purchase" or "checkout"',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test CAPI error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

