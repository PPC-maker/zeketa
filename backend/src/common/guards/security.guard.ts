import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

// In-memory store for rate limiting and IP blocking
// In production, use Redis for distributed systems
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Set<string>();
const suspiciousActivity = new Map<string, number>();

// Security configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute
const AUTH_RATE_LIMIT_MAX = 5; // 5 auth attempts per minute
const BLOCK_THRESHOLD = 10; // Block after 10 suspicious activities
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block

// Known attack patterns
const ATTACK_PATTERNS = [
  /\.\.\//g, // Directory traversal
  /<script/gi, // XSS
  /union.*select/gi, // SQL injection
  /exec\s*\(/gi, // Command injection
  /eval\s*\(/gi, // Code injection
  /javascript:/gi, // XSS
  /onerror=/gi, // XSS
  /onload=/gi, // XSS
  /document\./gi, // DOM manipulation
  /window\./gi, // Window manipulation
  /\$\{.*\}/g, // Template injection
  /{{.*}}/g, // Template injection
  /\0/g, // Null byte injection
];

@Injectable()
export class SecurityGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIP(request);
    const path = request.path;
    const method = request.method;

    // Check if IP is blocked
    if (blockedIPs.has(ip)) {
      throw new HttpException(
        'Access denied. Your IP has been blocked due to suspicious activity.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Check rate limiting
    const isAuthEndpoint = path.includes('/auth/');
    const maxRequests = isAuthEndpoint ? AUTH_RATE_LIMIT_MAX : RATE_LIMIT_MAX;

    if (!this.checkRateLimit(ip, maxRequests)) {
      this.recordSuspiciousActivity(ip, 'rate_limit_exceeded');
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check for malicious patterns in request
    const isMalicious = this.detectMaliciousRequest(request);
    if (isMalicious) {
      this.recordSuspiciousActivity(ip, 'malicious_pattern');
      throw new HttpException(
        'Invalid request detected.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate headers
    if (!this.validateHeaders(request)) {
      this.recordSuspiciousActivity(ip, 'invalid_headers');
    }

    return true;
  }

  private getClientIP(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  private checkRateLimit(ip: string, maxRequests: number): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  private detectMaliciousRequest(request: Request): boolean {
    const dataToCheck = [
      JSON.stringify(request.body || {}),
      JSON.stringify(request.query || {}),
      JSON.stringify(request.params || {}),
      request.url,
      ...Object.values(request.headers).map(String),
    ].join(' ');

    return ATTACK_PATTERNS.some((pattern) => pattern.test(dataToCheck));
  }

  private validateHeaders(request: Request): boolean {
    // Check for common security headers in request
    const userAgent = request.headers['user-agent'];

    // Block requests without user-agent (likely bots/scripts)
    if (!userAgent) {
      return false;
    }

    // Block known malicious user agents
    const maliciousAgents = [
      'sqlmap',
      'nikto',
      'nessus',
      'nmap',
      'masscan',
      'wpscan',
      'dirbuster',
      'gobuster',
    ];

    const lowerUA = userAgent.toLowerCase();
    if (maliciousAgents.some((agent) => lowerUA.includes(agent))) {
      return false;
    }

    return true;
  }

  private recordSuspiciousActivity(ip: string, type: string): void {
    const count = (suspiciousActivity.get(ip) || 0) + 1;
    suspiciousActivity.set(ip, count);

    console.warn(`[SECURITY] Suspicious activity from ${ip}: ${type} (count: ${count})`);

    if (count >= BLOCK_THRESHOLD) {
      blockedIPs.add(ip);
      console.error(`[SECURITY] IP ${ip} has been blocked due to repeated suspicious activity`);

      // Auto-unblock after BLOCK_DURATION
      setTimeout(() => {
        blockedIPs.delete(ip);
        suspiciousActivity.delete(ip);
        console.log(`[SECURITY] IP ${ip} has been unblocked`);
      }, BLOCK_DURATION);
    }
  }
}

// Export for use in logging
export function getBlockedIPs(): string[] {
  return Array.from(blockedIPs);
}

export function getSuspiciousActivity(): Map<string, number> {
  return new Map(suspiciousActivity);
}

export function manualBlockIP(ip: string): void {
  blockedIPs.add(ip);
}

export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
  suspiciousActivity.delete(ip);
}
