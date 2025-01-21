import { api } from '@/lib/axios'
import { GetLoansResponse } from './get-loans'

export interface GetLoansByStateQuery {
  state?: 'LOAN' | 'COMPLETED'
}


export async function getLoansByState({
  state
}: GetLoansByStateQuery): Promise<GetLoansResponse> {
  const response = await api.get<GetLoansResponse>('/loans/state', {
    params: {
      state
    },
  })

  return { loans: response.data.loans }
}