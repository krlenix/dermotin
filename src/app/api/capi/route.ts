import { NextRequest, NextResponse } from 'next/server';
import { sendCapiEvent, CAPI_EVENTS } from '@/lib/capi';
import { getFacebookTrackingData, getFbcFromUrl } from '@/utils/facebook-cookies';

const COUNTRIES = new Set(['rs', 'ba', 'me']);
// Kupovina (Purchase) ide ISKLJUČIVO iz /api/orders, posle prihvaćene porudžbine.
// Ovaj javni endpoint je nikada ne prima, inače bi bilo ko mogao da šalje lažne kupovine u Meta.
const MAX_EVENT_VALUE = 1_000_000;

/**
 * Universal CAPI endpoint that handles all event types
 * This is called automatically by the client-side tracking hook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventType,
      eventData = {},
      countryCode,
      eventId,
      pageUrl,
    } = body;

    if (typeof countryCode !== 'string' || !COUNTRIES.has(countryCode.toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Invalid country' }, { status: 400 });
    }
    const eventValue = Number(eventData.value);
    if (eventData.value !== undefined && (!Number.isFinite(eventValue) || eventValue < 0 || eventValue > MAX_EVENT_VALUE)) {
      return NextResponse.json({ success: false, error: 'Invalid value' }, { status: 400 });
    }


    // Get client information
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     undefined;
    const clientUserAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;
    const eventSourceUrl = pageUrl || referer;
    const hostname = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
                     request.headers.get('host') ||
                     undefined;

    // Get Facebook tracking data from cookies
    const cookieHeader = request.headers.get('cookie');
    const fbData = getFacebookTrackingData(cookieHeader);
    
    // If _fbc cookie doesn't exist, try to extract fbclid from page URL or referer
    let fbc = fbData.fbc;
    if (!fbc && (pageUrl || referer)) {
      fbc = getFbcFromUrl(pageUrl || referer);
      // if (fbc) {
      //   console.log('📊 Extracted fbclid from URL and created _fbc:', fbc);
      // }
    }

    // Map event type to CAPI event name
    let capiEventName: string;
    switch (eventType) {
      case 'page_view':
        capiEventName = CAPI_EVENTS.PAGE_VIEW;
        break;
      case 'view_content':
        capiEventName = CAPI_EVENTS.VIEW_CONTENT;
        break;
      case 'initiate_checkout':
        capiEventName = CAPI_EVENTS.INITIATE_CHECKOUT;
        break;
      case 'add_to_cart':
        capiEventName = CAPI_EVENTS.ADD_TO_CART;
        break;
      case 'lead':
        capiEventName = CAPI_EVENTS.LEAD;
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid event type' },
          { status: 400 }
        );
    }

    // Build user data
    const userData = {
      email: eventData.email || undefined,
      phone: eventData.phone || undefined,
      firstName: eventData.firstName || undefined,
      lastName: eventData.lastName || undefined,
      city: eventData.city || undefined,
      zip: eventData.zip || undefined,
      country: eventData.country || countryCode?.toUpperCase(),
      clientIpAddress: clientIp,
      clientUserAgent: clientUserAgent,
      fbp: fbData.fbp || undefined,
      fbc: fbc || undefined, // Use extracted fbc (either from cookie or URL)
    };

    // Build custom data
    const customData = {
      currency: eventData.currency,
      value: eventData.value ? Number(eventData.value) : undefined,
      content_type: eventData.content_type,
      content_name: eventData.content_name,
      content_category: eventData.content_category,
      content_ids: eventData.content_ids,
      contents: eventData.contents,
      num_items: eventData.num_items ? Number(eventData.num_items) : undefined,
      order_id: eventData.order_id,
    };

    // Send CAPI event
    const result = await sendCapiEvent(countryCode, {
      eventName: capiEventName,
      eventTime: Math.floor(Date.now() / 1000),
      eventId: eventId || undefined,
      eventSourceUrl,
      actionSource: 'website',
      userData,
      customData,
    }, hostname);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ CAPI API error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: 'CAPI error' }, { status: 500 });
  }
}

