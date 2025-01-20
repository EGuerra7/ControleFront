import { api } from '@/lib/axios'
import { GetProductResponse } from './get-products'

export interface GetProductsQuery {
  page: number | null
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
  page,
  name,
  category,
}: GetProductsQuery) {
  const response = await api.get<GetProductResponse>('/products/search', {
    params: {
      page,
      name,
      category,
    },
  })

  return { products: response.data.products, meta: response.data.meta }
}
