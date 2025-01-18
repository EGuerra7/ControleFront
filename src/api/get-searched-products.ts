import { api } from '@/lib/axios'
import { GetProductResponse } from './get-products'

export interface GetProductsQuery {
  name: string | null
  category: string | null
}

export interface Products {
  id: string
  name: string
  quantity: number
  localization: string
  category: string
}

export async function getSearchedProducts({
  name,
  category,
}: GetProductsQuery) {
  const response = await api.get<GetProductResponse>('/products/search', {
    params: {
      name,
      category,
    },
  })

  return response.data.products
}
