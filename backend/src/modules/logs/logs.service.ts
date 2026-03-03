import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogsService {
  private readonly logger = new Logger('LogsService');

  async logLoginAttempt(
    email: string,
    ip: string,
    success: boolean,
    userAgent?: string,
  ): Promise<void> {
    const status = success ? 'SUCCESS' : 'FAILED';
    this.logger.log(
      `Login ${status}: ${email} from IP: ${ip}${userAgent ? ` | UA: ${userAgent}` : ''}`,
    );
  }

  async info(message: string, metadata?: Record<string, any>): Promise<void> {
    this.logger.log(`${message}${metadata ? ` | ${JSON.stringify(metadata)}` : ''}`);
  }

  async warn(message: string, metadata?: Record<string, any>): Promise<void> {
    this.logger.warn(`${message}${metadata ? ` | ${JSON.stringify(metadata)}` : ''}`);
  }

  async error(message: string, metadata?: Record<string, any>): Promise<void> {
    this.logger.error(`${message}${metadata ? ` | ${JSON.stringify(metadata)}` : ''}`);
  }
}
