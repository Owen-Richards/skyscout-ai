import { z } from 'zod';
import { router, baseProcedure, protectedProcedure } from './trpc';
import { TRPCError } from '@trpc/server';

import { authService } from '../services/auth.service';

export const authRouter = router({
  register: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(128),
        firstName: z.string().min(1).max(50),
        lastName: z.string().min(1).max(50),
        dateOfBirth: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        phoneNumber: z.string().optional(),
        preferredCurrency: z.string().length(3).default('USD'),
        preferredLanguage: z.string().length(2).default('en'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await authService.register(input);
        return {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token: user.token,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register user',
        });
      }
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        rememberMe: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await authService.login(input);

        // Set secure HTTP-only cookie
        ctx.res.setCookie('auth-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: input.rememberMe
            ? 7 * 24 * 60 * 60 * 1000
            : 24 * 60 * 60 * 1000, // 7 days or 1 day
        });

        return {
          user: result.user,
          token: result.token,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    // Clear the cookie
    ctx.res.clearCookie('auth-token');

    // Optionally add token to blacklist in Redis
    if (ctx.req.headers.authorization) {
      const token = ctx.req.headers.authorization.slice(7);
      await authService.invalidateToken(token);
    }

    return { success: true };
  }),

  refreshToken: protectedProcedure.mutation(async ({ ctx }) => {
    const newToken = await authService.refreshToken(ctx.user.id);

    ctx.res.setCookie('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return { token: newToken };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await authService.getUserById(ctx.user.id);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(50).optional(),
        lastName: z.string().min(1).max(50).optional(),
        dateOfBirth: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        phoneNumber: z.string().optional(),
        preferredCurrency: z.string().length(3).optional(),
        preferredLanguage: z.string().length(2).optional(),
        preferences: z
          .object({
            emailNotifications: z.boolean().optional(),
            smsNotifications: z.boolean().optional(),
            priceAlerts: z.boolean().optional(),
            newsletter: z.boolean().optional(),
            cabin: z
              .enum(['economy', 'premium_economy', 'business', 'first'])
              .optional(),
            airlines: z.array(z.string()).optional(),
            maxStops: z.number().min(0).max(3).optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await authService.updateUser(ctx.user.id, input);
      return updatedUser;
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await authService.changePassword(
        ctx.user.id,
        input.currentPassword,
        input.newPassword
      );
      return { success: true };
    }),

  forgotPassword: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      await authService.sendPasswordResetEmail(input.email);
      return { success: true };
    }),

  resetPassword: baseProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ input }) => {
      await authService.resetPassword(input.token, input.newPassword);
      return { success: true };
    }),

  verifyEmail: baseProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await authService.verifyEmail(input.token);
      return { success: true };
    }),

  resendVerification: protectedProcedure.mutation(async ({ ctx }) => {
    await authService.resendVerificationEmail(ctx.user.id);
    return { success: true };
  }),
});
