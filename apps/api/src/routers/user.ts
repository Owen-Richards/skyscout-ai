import { z } from 'zod';
import { router, protectedProcedure } from './trpc';
import { authService } from '../services/auth.service';

export const userRouter = router({
  profile: protectedProcedure.query(async ({ ctx }) => {
    return await authService.getUserById(ctx.user.id);
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
        avatar: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await authService.updateUser(ctx.user.id, input);
    }),

  preferences: protectedProcedure.query(async ({ ctx }) => {
    const user = await authService.getUserById(ctx.user.id);
    return user?.preferences;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional(),
        priceAlerts: z.boolean().optional(),
        newsletter: z.boolean().optional(),
        cabin: z
          .enum(['economy', 'premium_economy', 'business', 'first'])
          .optional(),
        preferredAirlines: z.array(z.string()).optional(),
        maxStops: z.number().min(0).max(3).optional(),
        seatPreference: z.enum(['aisle', 'window', 'middle']).optional(),
        mealPreference: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await authService.updateUser(ctx.user.id, { preferences: input });
    }),

  deleteAccount: protectedProcedure
    .input(
      z.object({
        password: z.string(),
        confirmation: z.literal('DELETE_MY_ACCOUNT'),
      })
    )
    .mutation(async ({ input: _input, ctx: _ctx }) => {
      // TODO: Implement account deletion
      // This should:
      // 1. Verify password
      // 2. Anonymize or delete user data
      // 3. Cancel active subscriptions
      // 4. Send confirmation email

      return { success: true, message: 'Account deletion initiated' };
    }),
});
