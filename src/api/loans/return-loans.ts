import { api } from '@/lib/axios'
import { Loan } from './get-loans'

export interface ReturnLoanBody {
    loanId: string
    products: {
        id: string
        return_quantity: number
    }[]
}

export async function returnLoan({ loanId, products }: ReturnLoanBody): Promise<Loan> {
    const response = await api.patch('/loans/return', {
        loanId,
        products,
    })

    return response.data
}
