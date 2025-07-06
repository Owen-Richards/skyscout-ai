'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';
import { httpBatchLink } from '@trpc/client';
export function TRPCProvider({ children }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/trpc',
            }),
        ],
    }));
    return (<trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>);
}
