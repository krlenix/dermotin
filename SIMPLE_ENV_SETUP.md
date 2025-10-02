# Simple Environment Variable Setup

The system uses **country-based configuration only** - no domain-specific logic. Keep it simple!

## 📝 Your `.env.local` Should Look Like This:

```bash
# ============================================
# META PIXEL & CAPI - Country Based
# ============================================

# Serbia (RS)
NEXT_PUBLIC_META_PIXEL_RS=804157495892896
META_CAPI_TOKEN_RS=EAAyour_actual_token_here
META_CAPI_TEST_CODE_RS=TEST91894

# Bosnia (BA)
NEXT_PUBLIC_META_PIXEL_BA=987654321098765
META_CAPI_TOKEN_BA=EAAyour_actual_token_here
META_CAPI_TEST_CODE_BA=TEST12345

# TikTok (Optional)
NEXT_PUBLIC_TIKTOK_PIXEL_RS=C123456789
NEXT_PUBLIC_TIKTOK_PIXEL_BA=C987654321

# ============================================
# OTHER CONFIGS
# ============================================
NEXT_PUBLIC_DOMAIN=dermotin.shop
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 🎯 Variable Format

**Meta Pixel (Browser):**
- `NEXT_PUBLIC_META_PIXEL_{COUNTRY}`
- Example: `NEXT_PUBLIC_META_PIXEL_RS`

**Meta CAPI Token (Server):**
- `META_CAPI_TOKEN_{COUNTRY}`
- Example: `META_CAPI_TOKEN_RS`

**Meta Test Code (Optional):**
- `META_CAPI_TEST_CODE_{COUNTRY}`
- Example: `META_CAPI_TEST_CODE_RS`

**TikTok Pixel (Browser, Optional):**
- `NEXT_PUBLIC_TIKTOK_PIXEL_{COUNTRY}`
- Example: `NEXT_PUBLIC_TIKTOK_PIXEL_RS`

## ✅ Supported Countries

- `RS` - Serbia
- `BA` - Bosnia and Herzegovina
- `BG` - Bulgaria
- `HR` - Croatia
- `ME` - Montenegro
- `RO` - Romania
- `EU` - European Union (fallback)

## 🔄 After Adding Variables

1. **Restart dev server**: `npm run dev`
2. **Reload browser**: F5
3. **Test**: Run `debugPixelConfig()` in console

## 📊 Expected Debug Output

```
📍 Current domain: localhost
📋 Configuration Type: Country-based only

🇷🇸 Serbia (RS) Configuration:
  NEXT_PUBLIC_META_PIXEL_RS: 804157495892896
  ✅ Using: 804157495892896

📡 Meta Pixel Status:
  ✅ Meta Pixel (fbq) is loaded

📊 Summary:
✅ Pixel is configured and loaded correctly
```

## 🎯 Benefits of Simple Country-Based Config

✅ **Easy to understand** - no complex domain logic  
✅ **Works everywhere** - localhost, staging, production  
✅ **Easy to test** - same config for all environments  
✅ **No confusion** - one pixel per country, that's it  

## 🔒 Security Note

- **`NEXT_PUBLIC_*`** variables are exposed to the browser (client-side)
- **`META_CAPI_TOKEN_*`** are server-side only (NOT exposed to browser)
- Never commit `.env.local` to git!

