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
}

export async function getProduct({ page }: GetProductsQuery) {
  const response = await api.get<GetProductResponse>('/products', {
    params: {
      page,
    },
  })

  return response.data.products
}
