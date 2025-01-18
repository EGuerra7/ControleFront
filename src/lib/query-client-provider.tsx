'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export default function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
