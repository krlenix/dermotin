# 🚀 Automatic CAPI Tracking - Complete Guide

## Overview

Your site now automatically fires **Meta Conversion API (CAPI)** events for **ALL** tracking events alongside browser pixel tracking. This provides redundancy and improves tracking accuracy, especially when browser-side tracking is blocked by ad blockers or privacy tools.

## 🎯 What's Implemented

### **Automatic CAPI for All Events**

Every time a pixel event fires in the browser, it **automatically** sends the same event to CAPI (server-side). No manual intervention needed!

### **Events That Fire CAPI Automatically:**

1. **PageView** - When any page loads
2. **ViewContent** - When viewing a product
3. **InitiateCheckout** - When checkout form is opened
4. **Purchase** - When an order is completed
5. **AddToCart** - When adding items to cart
6. **Lead** - When form submissions occur

## 🔧 How It Works

### **1. Unified Tracking Hook**

The `usePixelTracking` hook now fires **THREE** tracking systems simultaneously:

```typescript
trackEvent('purchase', {
  currency: 'RSD',
  value: 5990,
  // ... other data
});
```

This single call triggers:
- ✅ **Meta Browser Pixel** (client-side)
- ✅ **TikTok Pixel** (client-side)
- ✅ **Meta CAPI** (server-side)

### **2. Event Deduplication**

Each event gets a unique `eventId` that's shared between:
- Browser pixel: `eventID` parameter
- CAPI: `event_id` parameter

Meta automatically deduplicates events with the same ID, ensuring you don't double-count conversions!

### **3. Automatic PageView Tracking**

When your site loads, `PixelTracker` component automatically:
1. Initializes Meta Pixel
2. Fires PageView to browser pixel
3. Fires PageView to CAPI
4. Uses same event ID for deduplication

## 📁 File Structure

```
src/
├── app/api/
│   ├── capi/
│   │   └── route.ts          # Universal CAPI endpoint
│   └── test-capi/
│       └── route.ts           # Test endpoint
├── components/tracking/
│   └── PixelTracker.tsx       # Updated with auto CAPI
├── lib/
│   └── capi.ts                # CAPI service with debug logs
└── config/
    └── pixels.ts              # Pixel configuration
```

## 🧪 Testing

### **Method 1: Test Page (HTML)**
Open in browser:
```
http://localhost:3000/capi-test.html
```

### **Method 2: Test API Endpoint**
```
http://localhost:3000/api/test-capi?country=rs&event=purchase
```

### **Method 3: Real User Flow**
1. Visit your landing page
2. Open browser console (F12)
3. Check your **terminal** (where `npm run dev` runs)
4. You'll see detailed CAPI logs for:
   - PageView (on page load)
   - ViewContent (if viewing products)
   - InitiateCheckout (when opening checkout)
   - Purchase (after completing order)

## 📊 What You'll See in Terminal

```
================================================================================
🚀 CAPI EVENT TRIGGERED
================================================================================
📊 Event Details:
  Event Name: Purchase
  Event ID: 1234567890-abc123
  Country: rs
  Pixel ID: 123456789012345
  Test Mode: true
  Event Source URL: https://yoursite.com/rs
  Action Source: website

👤 Raw User Data (before hashing):
  Email: customer@example.com
  Phone: +381601234567
  First Name: John
  Last Name: Doe
  City: Belgrade
  Country: RS
  Client IP: 192.168.1.1
  FBP Cookie: fb.1.1234567890.123456789

🔐 Hashed User Data (what gets sent to Meta):
  Email (em): [SHA-256 hash]
  Phone (ph): [SHA-256 hash]
  First Name (fn): [SHA-256 hash]
  Last Name (ln): [SHA-256 hash]

💰 Custom Data:
  Currency: RSD
  Value: 5990
  Content IDs: ["biomelis-3"]
  Num Items: 3
  Order ID: WEB-1234567890-abc123

📦 Complete Payload Structure:
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1234567890,
      "event_id": "1234567890-abc123",
      ...
    }
  ]
}

🌐 API Request:
  URL: https://graph.facebook.com/v21.0/[pixel-id]/events
  Method: POST
  Has Access Token: true

📤 Sending request to Meta...

📥 Response from Meta:
  Status: 200
  OK: true
  Result: {
    "events_received": 1,
    "messages": []
  }

✅ CAPI EVENT SENT SUCCESSFULLY
  Events Received: 1
  Messages: None
================================================================================
```

## 🔍 Viewing Events in Meta

### **For Test Events:**

1. Go to **Meta Events Manager**
2. Select your pixel
3. Click **Test Events** tab
4. Make sure your **Test Event Code** is configured in `.env.local`:
   ```env
   META_CAPI_TEST_CODE_RS=TEST12345
   META_CAPI_TEST_CODE_BA=TEST12345
   META_CAPI_TEST_CODE_HR=TEST12345
   ```
5. Fire a test event
6. Watch it appear in real-time!

### **For Production Events:**

1. Go to **Meta Events Manager**
2. Select your pixel
3. Click **Overview** or **Events** tab
4. You'll see:
   - **Browser events** (from pixel)
   - **Server events** (from CAPI)
   - **Deduplicated total** (combined, no double counting)

## 🎛️ Configuration

### **Environment Variables Required:**

```env
# Meta Pixel IDs (public - used in browser)
NEXT_PUBLIC_META_PIXEL_RS=your_pixel_id_here
NEXT_PUBLIC_META_PIXEL_BA=your_pixel_id_here
NEXT_PUBLIC_META_PIXEL_HR=your_pixel_id_here

# CAPI Access Tokens (private - server only)
META_CAPI_TOKEN_RS=your_access_token_here
META_CAPI_TOKEN_BA=your_access_token_here
META_CAPI_TOKEN_HR=your_access_token_here

# Optional: Test Event Codes (for testing)
META_CAPI_TEST_CODE_RS=TEST12345
META_CAPI_TEST_CODE_BA=TEST12345
META_CAPI_TEST_CODE_HR=TEST12345
```

### **Getting CAPI Access Token:**

1. Go to **Meta Events Manager**
2. Select your pixel
3. Click **Settings** → **Conversions API**
4. Click **Generate Access Token**
5. Copy and paste into `.env.local`

### **Getting Test Event Code:**

1. Go to **Meta Events Manager**
2. Select your pixel
3. Click **Test Events** tab
4. Your test code is shown at the top
5. Copy and paste into `.env.local`

## 🔄 Event Flow Diagram

```
User Action
    ↓
trackEvent() called
    ↓
    ├─→ Browser Pixel (fbq)
    │   └─→ Meta Pixel receives event
    │
    ├─→ TikTok Pixel (ttq)
    │   └─→ TikTok receives event
    │
    └─→ CAPI API (/api/capi)
        └─→ capi.ts service
            └─→ Meta CAPI endpoint
                └─→ Meta receives server event
```

## 🚨 Troubleshooting

### **"I don't see CAPI events in terminal"**

Check:
- ✅ Dev server is running (`npm run dev`)
- ✅ You're looking at the **terminal** (not browser console)
- ✅ CAPI is enabled in `.env.local`
- ✅ Access token is valid

### **"Events show 200 OK but not in Meta"**

This means CAPI is working! For test events:
- ✅ Add `META_CAPI_TEST_CODE_XX` to `.env.local`
- ✅ Restart dev server
- ✅ Go to Meta Events Manager → Test Events tab

For production events:
- ✅ Remove test code or go to **Overview** tab in Meta

### **"CAPI not enabled for country"**

Add to `.env.local`:
```env
META_CAPI_TOKEN_RS=your_token_here
```

Then restart server.

## 📈 Benefits

1. **🎯 Better Tracking Accuracy** - Server-side tracking can't be blocked
2. **🔄 Redundancy** - If browser pixel fails, CAPI still works
3. **📊 No Double Counting** - Event deduplication ensures accurate metrics
4. **🤖 Automatic** - No manual intervention needed
5. **🧪 Easy Testing** - Built-in test endpoints and detailed logging

## 🎉 You're All Set!

CAPI is now firing automatically for all events across your entire site. Every tracking call now:
- Sends to browser pixel
- Sends to CAPI
- Uses event deduplication
- Provides detailed debug logs

Just use your existing `trackEvent()` calls, and everything happens automatically! 🚀

