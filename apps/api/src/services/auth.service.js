import { __awaiter } from "tslib";
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { prisma } from '../db/client';
import { CacheService } from '../db/redis';
import { config } from '../config';
import { logger } from '../utils/logger';
class AuthService {
    constructor() {
        this.jwtSecret = new TextEncoder().encode(config.JWT_SECRET);
        this.saltRounds = 12;
    }
    register(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield prisma.user.findUnique({
                where: { email: input.email },
            });
            if (existingUser) {
                throw new Error('User already exists');
            }
            // Hash password
            const passwordHash = yield bcrypt.hash(input.password, this.saltRounds);
            // Generate email verification token
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            // Create user
            const user = yield prisma.user.create({
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
            const token = yield this.generateToken(user.id, user.email, ['user']);
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
        });
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user
            const user = yield prisma.user.findUnique({
                where: { email: input.email },
                include: { preferences: true },
            });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Verify password
            const isValidPassword = yield bcrypt.compare(input.password, user.passwordHash);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }
            // Update last login
            yield prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });
            // Generate JWT token
            const token = yield this.generateToken(user.id, user.email, ['user']);
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
        });
    }
    refreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return yield this.generateToken(user.id, user.email, ['user']);
        });
    }
    invalidateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add token to blacklist in Redis
            const key = `blacklist:${token}`;
            yield CacheService.set(key, true, 7 * 24 * 60 * 60); // 7 days
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            if (data.preferences) {
                updateData.preferences = {
                    upsert: {
                        create: data.preferences,
                        update: data.preferences,
                    },
                };
            }
            delete updateData.preferences;
            const user = yield prisma.user.update({
                where: { id: userId },
                data: updateData,
                include: { preferences: true },
            });
            return user;
        });
    }
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            // Verify current password
            const isValidPassword = yield bcrypt.compare(currentPassword, user.passwordHash);
            if (!isValidPassword) {
                throw new Error('Invalid current password');
            }
            // Hash new password
            const newPasswordHash = yield bcrypt.hash(newPassword, this.saltRounds);
            // Update password
            yield prisma.user.update({
                where: { id: userId },
                data: { passwordHash: newPasswordHash },
            });
            logger.info('Password changed:', { userId });
        });
    }
    sendPasswordResetEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            yield prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordResetToken: resetToken,
                    passwordResetExpires: resetExpires,
                },
            });
            // TODO: Send password reset email
            logger.info('Password reset requested:', { userId: user.id, email });
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
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
            const passwordHash = yield bcrypt.hash(newPassword, this.saltRounds);
            // Update password and clear reset token
            yield prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordHash,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                },
            });
            logger.info('Password reset completed:', { userId: user.id });
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
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
            yield prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true,
                    emailVerificationToken: null,
                    emailVerificationExpires: null,
                },
            });
            logger.info('Email verified:', { userId: user.id });
        });
    }
    resendVerificationEmail(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            yield prisma.user.update({
                where: { id: userId },
                data: {
                    emailVerificationToken,
                    emailVerificationExpires,
                },
            });
            // TODO: Send verification email
            logger.info('Verification email resent:', { userId });
        });
    }
    generateToken(userId, email, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield new SignJWT({
                sub: userId,
                email,
                roles,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime(config.JWT_EXPIRES_IN)
                .sign(this.jwtSecret);
            return token;
        });
    }
}
export const authService = new AuthService();
