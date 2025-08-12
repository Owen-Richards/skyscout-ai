import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@skyscout/trpc';

export const trpc = createTRPCReact<AppRouter>();
