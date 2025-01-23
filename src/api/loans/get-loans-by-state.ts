import { api } from '@/lib/axios'
import { Loan } from './get-loans'

export interface GetLoansByStateQuery {
  state?: 'LOAN' | 'COMPLETED'
}

export interface GetLoansByStateResponse {
  loans: Loan[]
}

export async function getLoansByState({
  state,
}: GetLoansByStateQuery): Promise<GetLoansByStateResponse> {
  const response = await api.get<GetLoansByStateResponse>('/loans/state', {
    params: {
      state,
    },
  })

  return { loans: response.data.loans }
}
