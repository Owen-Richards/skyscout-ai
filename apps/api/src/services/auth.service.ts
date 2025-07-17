import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { prisma } from '../db/client';
import { CacheService } from '../db/redis';
import { config } from '../config';
import { logger } from '../utils/logger';

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  preferredCurrency?: string;
  preferredLanguage?: string;
}

interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface UserWithToken {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  token: string;
}

class AuthService {
  private readonly jwtSecret = new TextEncoder().encode(config.JWT_SECRET);
  private readonly saltRounds = 12;

  async register(input: RegisterInput): Promise<UserWithToken> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, this.saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        phoneNumber: input.phoneNumber,
        preferredCurrency: input.preferredCurrency || 'USD',
        preferredLanguage: input.preferredLanguage || 'en',
        emailVerificationToken,
        emailVerificationExpires,
        preferences: {
          create: {
            emailNotifications: true,
            priceAlerts: true,
            newsletter: true,
          },
        },
      },
    });

    // Generate JWT token
    const token = await this.generateToken(user.id, user.email, ['user']);

    // TODO: Send verification email
    logger.info('User registered:', { userId: user.id, email: user.email });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      token,
    };
  }

  async login(
    input: LoginInput
  ): Promise<{ user: Omit<UserWithToken, 'token'>; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { preferences: true },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      input.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = await this.generateToken(user.id, user.email, ['user']);

    logger.info('User logged in:', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      token,
    };
  }

  async refreshToken(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.generateToken(user.id, user.email, ['user']);
  }

  async invalidateToken(token: string): Promise<void> {
    // Add token to blacklist in Redis
    const key = `blacklist:${token}`;
    await CacheService.set(key, true, 7 * 24 * 60 * 60); // 7 days
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        dateOfBirth: true,
        phoneNumber: true,
        preferredCurrency: true,
        preferredLanguage: true,
        avatar: true,
        preferences: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateUser(
    userId: string,
    data: Partial<RegisterInput> & { preferences?: Record<string, unknown> }
  ) {
    const updateData: Record<string, unknown> = { ...data };

    if (data.preferences) {
      updateData.preferences = {
        upsert: {
          create: data.preferences,
          update: data.preferences,
        },
      };
    }

    delete updateData.preferences;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { preferences: true },
    });

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    logger.info('Password changed:', { userId });
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send password reset email
    logger.info('Password reset requested:', { userId: user.id, email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, this.saltRounds);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    logger.info('Password reset completed:', { userId: user.id });
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    logger.info('Email verified:', { userId: user.id });
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // TODO: Send verification email
    logger.info('Verification email resent:', { userId });
  }

  private async generateToken(
    userId: string,
    email: string,
    roles: string[]
  ): Promise<string> {
    const token = await new SignJWT({
      sub: userId,
      email,
      roles,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(config.JWT_EXPIRES_IN)
      .sign(this.jwtSecret);

    return token;
  }
}

export const authService = new AuthService();
