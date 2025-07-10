import type { AppRouter } from '@skyscout/trpc';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
