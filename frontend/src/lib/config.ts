// API URL configuration
// In production (Cloud Run), we use the backend URL directly
// In development, we use localhost

export function getApiUrl(): string {
  // Check if we have a build-time env variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Check if we're in the browser and on production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Production - Cloud Run
    if (hostname.includes('run.app') || hostname.includes('zeketa')) {
      return 'https://zeketa-backend-280659436731.me-west1.run.app';
    }
  }

  // Default to localhost for development
  return 'http://localhost:4000';
}

export const API_URL = getApiUrl();
