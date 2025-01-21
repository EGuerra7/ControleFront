import { api } from '@/lib/axios'
import { Products } from '../products/get-products'

export interface GetLoansQuery {
  page: number | null
}

export interface GetLoansResponse {
  loans: {
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
  }[]
}

export async function getLoans({
  page,
}: GetLoansQuery): Promise<GetLoansResponse> {
  const response = await api.get<GetLoansResponse>('/loans', {
    params: {
      page,
    },
  })

  return { loans: response.data.loans }
}
