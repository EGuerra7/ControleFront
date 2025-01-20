import { api } from '@/lib/axios'

export interface CreateLoanBody {
  responsible: string
  products: {
    id: string
    loan_quantity: number
    return_quantity: number
  }[]
}

export async function createLoan({ responsible, products }: CreateLoanBody) {
  const loan = await api.post('/loans', {
    responsible,
    products,
  })

  return loan
}
