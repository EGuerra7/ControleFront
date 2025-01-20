import { api } from '@/lib/axios'

export interface GetProductsQuery {
  page: number | null
}

export interface Products {
  id: string
  name: string
  quantity: number
  localization: string
  category: string
}

export interface GetProductResponse {
  products: Products[]
  meta: {
    totalCount: number
    totalPages: number
  }
}

export async function getProduct({ page }: GetProductsQuery) {
  const response = await api.get<GetProductResponse>('/products', {
    params: {
      page,
    },
  })

  return { products: response.data.products, meta: response.data.meta }
}
