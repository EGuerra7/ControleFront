import { api } from '@/lib/axios'
import { GetLoansResponse } from './get-loans'

export interface SearchLoansQuery {
  page?: number | null
  responsible?: string
  state?: 'LOAN' | 'COMPLETED' | 'all' | null
}

export async function searchLoans({
  page,
  responsible,
  state,
}: SearchLoansQuery): Promise<GetLoansResponse> {
  if (state === 'all') {
    state = null
  }

  const response = await api.get<GetLoansResponse>('/loans/search', {
    params: {
      page,
      responsible,
      state,
    },
  })

  return { loans: response.data.loans, meta: response.data.meta }
}
