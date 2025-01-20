import { api } from '@/lib/axios'
import { Products } from './get-products'

export interface GetAllProductResponse {
  products: Products[]
}

export async function getAllProduct() {
  const response = await api.get<GetAllProductResponse>('/products/all')

  return { products: response.data.products }
}
