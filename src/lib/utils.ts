import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the current app URL dynamically
 * Works in both client and server environments
 * Prioritizes URL-based detection over environment variables
 */
export function getAppUrl(): string {
  // In browser environment - always use the actual URL
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // In server environment, try to get from request headers first
  // This will be handled by passing the request context when needed
  
  // Fallback to environment variables only if URL detection is not available
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (process.env.NEXT_PUBLIC_DOMAIN) {
    return process.env.NEXT_PUBLIC_DOMAIN
  }
  
  // For development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // This should not happen in production if environment variables are set correctly
  throw new Error('Unable to determine app URL. Please set NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_DOMAIN environment variable.')
}

/**
 * Get the website domain without protocol
 */
export function getWebsiteDomain(): string {
  const url = getAppUrl()
  return url.replace(/^https?:\/\//, '')
}

/**
 * Get the website domain from request headers (for server-side usage)
 */
export function getWebsiteDomainFromRequest(request: Request): string {
  const host = request.headers.get('host')
  if (host) {
    return host
  }
  
  // Fallback to environment variables if no host header
  return getWebsiteDomain()
}
