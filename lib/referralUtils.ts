/**
 * Utility functions for referral system
 * Provides secure encoding/decoding of Ethereum addresses for referral links
 */

import { isAddress } from 'viem';

/**
 * Encode an Ethereum address for use in referral links
 * Uses base64 encoding with URL-safe characters to obscure the raw address
 * @param address - Ethereum address to encode
 * @returns Encoded string for use in referral links
 */
export function encodeReferrerAddress(address: string): string {
  if (!isAddress(address)) {
    throw new Error('Invalid Ethereum address');
  }
  
  // Remove '0x' prefix and convert to Buffer
  const addressBytes = Buffer.from(address.slice(2), 'hex');
  
  // Encode to base64url (URL-safe base64)
  return addressBytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Decode a referrer code back to an Ethereum address
 * @param code - Encoded referrer code from referral link
 * @returns Ethereum address or null if invalid
 */
export function decodeReferrerAddress(code: string): string | null {
  try {
    // Add padding if needed and convert back from URL-safe base64
    const paddedCode = code + '='.repeat((4 - code.length % 4) % 4);
    const base64 = paddedCode.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode from base64
    const addressBytes = Buffer.from(base64, 'base64');
    
    // Convert back to hex with '0x' prefix
    const address = '0x' + addressBytes.toString('hex');
    
    // Validate the decoded address
    if (!isAddress(address)) {
      return null;
    }
    
    return address;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a complete referral URL
 * @param referrerAddress - Ethereum address of the referrer
 * @param baseUrl - Base URL of the application (optional, uses current origin)
 * @returns Complete referral URL
 */
export function generateReferralUrl(referrerAddress: string, baseUrl?: string): string {
  const code = encodeReferrerAddress(referrerAddress);
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/referral/${code}`;
}

/**
 * Extract referrer address from URL pathname
 * @param pathname - URL pathname (e.g., '/referral/abc123')
 * @returns Referrer address or null if not a valid referral path
 */
export function extractReferrerFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/referral\/([^\/]+)$/);
  if (!match) {
    return null;
  }
  
  return decodeReferrerAddress(match[1]);
}

/**
 * Store referrer information in sessionStorage for later use
 * @param referrerAddress - Ethereum address of the referrer
 */
export function storeReferrer(referrerAddress: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('pending_referrer', referrerAddress);
  }
}

/**
 * Get stored referrer information from sessionStorage
 * @returns Referrer address or null if not found
 */
export function getStoredReferrer(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('pending_referrer');
  }
  return null;
}

/**
 * Clear stored referrer information
 */
export function clearStoredReferrer(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('pending_referrer');
  }
}
