import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  private firebaseApp: admin.app.App;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async verifyPhone(phone_e164: string): Promise<void> {
    // Firebase Auth handles OTP sending
    // This is a placeholder - implement Firebase Admin SDK phone auth
    // For now, just log
    console.log(`OTP sent to ${phone_e164}`);
  }

  async exchangeToken(phone_e164: string, otp_code: string): Promise<{ access_token: string; refresh_token: string }> {
    // Verify OTP with Firebase
    // TODO: Implement Firebase Admin SDK verification
    
    // Find or create user
    let user = await this.usersService.findByPhone(phone_e164);
    if (!user) {
      user = await this.usersService.create(phone_e164);
    }

    // Generate JWT
    const payload = { sub: user.id, phone_e164: user.phone_e164, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { access_token, refresh_token };
  }

  async validateUser(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

