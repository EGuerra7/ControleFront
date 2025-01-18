import { api } from '@/lib/axios'
import { Products } from './get-products'

export interface CreateProductBody {
  name: string
  category: string
  quantity: number
  localization: string
}

export async function createProduct({
  name,
  quantity,
  localization,
  category,
}: CreateProductBody) {
  const product: Products = await api.post('/products', {
    name,
    quantity,
    localization,
    category,
  })

  return product
}
