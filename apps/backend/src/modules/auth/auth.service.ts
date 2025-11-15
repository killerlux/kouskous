import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as admin from 'firebase-admin';

interface JwtPayload {
  sub: string;
  phone_e164: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private firebaseApp: admin.app.App | undefined;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        try {
          this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          });
          this.logger.log('Firebase Admin initialized');
        } catch (error) {
          this.logger.error('Failed to initialize Firebase Admin', error);
        }
      } else {
        this.logger.warn(
          'Firebase credentials not configured; OTP verification will be mocked',
        );
      }
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async verifyPhone(phone_e164: string): Promise<void> {
    // In production, Firebase handles OTP via its client SDK
    // The backend doesn't send OTPs directly; it validates them
    // This endpoint exists for completeness but is typically not called
    // since the client SDK (Flutter) sends OTP directly

    this.logger.log(`OTP request for ${phone_e164}`);

    // Optional: Store OTP requests for rate-limiting/auditing
    // For now, just acknowledge
  }

  async exchangeToken(
    phone_e164: string,
    otp_code: string,
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    // Verify OTP with Firebase
    // Note: Firebase phone auth typically uses ID tokens from client SDK
    // For MVP, we'll implement a simplified flow:
    // 1. In production: verify Firebase ID token
    // 2. For development: accept specific test OTP

    const isDev = this.configService.get<string>('NODE_ENV') !== 'production';

    if (isDev && otp_code === '000000') {
      // Development bypass
      this.logger.warn(`Dev mode: accepting test OTP for ${phone_e164}`);
    } else if (!this.firebaseApp) {
      throw new UnauthorizedException(
        'Authentication service not configured',
      );
    } else {
      // In production, validate the OTP via Firebase custom token or ID token
      // This is a simplified check; real implementation would verify via Firebase
      try {
        // TODO: Implement actual Firebase phone auth verification
        // For now, reject invalid OTPs in production
        if (!isDev) {
          throw new UnauthorizedException('Invalid OTP');
        }
      } catch (error) {
        this.logger.error(`OTP verification failed for ${phone_e164}`, error);
        throw new UnauthorizedException('Invalid OTP');
      }
    }

    // Find or create user
    let user = await this.usersService.findByPhone(phone_e164);
    if (!user) {
      user = await this.usersService.create({ phone_e164, role: 'client' });
      this.logger.log(`New user created: ${user.id}`);
    }

    // Generate JWT tokens
    const payload: JwtPayload = {
      sub: user.id,
      phone_e164: user.phone_e164,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.logger.log(`Tokens issued for user ${user.id}`);

    return {
      access_token,
      refresh_token,
      expires_in: 900, // 15 minutes in seconds
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Direct admin login (bypasses OTP for admin users)
   * Uses simple password check for development/admin access
   */
  async adminLogin(
    phone_e164: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    // Find user
    const user = await this.usersService.findByPhone(phone_e164);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if admin
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    // Simple password check (in production, use proper password hashing)
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD', 'admin123');
    if (password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT tokens
    const payload: JwtPayload = {
      sub: user.id,
      phone_e164: user.phone_e164,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.logger.log(`Admin login successful for ${phone_e164}`);

    return {
      access_token,
      refresh_token,
      expires_in: 900, // 15 minutes
    };
  }
}

