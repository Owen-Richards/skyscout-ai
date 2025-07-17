import { router } from './trpc';
import { authRouter } from './auth';
import { flightRouter } from './flight';
import { userRouter } from './user';
import { analyticsRouter } from './analytics';

export const appRouter = router({
  auth: authRouter,
  flight: flightRouter,
  user: userRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
