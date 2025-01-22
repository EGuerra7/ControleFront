import { api } from '@/lib/axios'
import { Products } from '../products/get-products'

interface GetLoansQuery {
  page: number | null
}

export interface Loan {
  id: string
  responsible: string
  state: 'LOAN' | 'COMPLETED'
  created_at: string
  products: {
    id: string
    product_id: string
    loan_id: string
    loan_quantity: number
    return_quantitty: number
    product: Products
  }[]
}

export interface GetLoansResponse {
  loans: Loan[]
  meta: {
    totalCount: number
    totalPages: number
  }
}

export async function getLoans({
  page,
}: GetLoansQuery): Promise<GetLoansResponse> {
  const response = await api.get<GetLoansResponse>('/loans', {
    params: {
      page,
    },
  })

  return { loans: response.data.loans, meta: response.data.meta }
}
