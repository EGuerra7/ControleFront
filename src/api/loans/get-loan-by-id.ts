import { api } from '@/lib/axios'
import { Loan } from './get-loans'

export interface GetLoansByIdQuery {
  loanId: string
}

interface GetLoansByIdResponse {
  loan: Loan
}

export async function getLoansById({
  loanId,
}: GetLoansByIdQuery): Promise<GetLoansByIdResponse> {
  const response = await api.get<GetLoansByIdResponse>(`/loans/${loanId}`)

  return { loan: response.data.loan }
}
