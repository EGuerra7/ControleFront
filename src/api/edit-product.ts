import { api } from '@/lib/axios'
import { Products } from './get-products'

export interface EditProductBody {
    id: string
    name: string
    category: string
    quantity: number
    localization: string
}

export async function editProduct({
    id,
    name,
    quantity,
    localization,
    category,
}: EditProductBody) {
    const product: Products = await api.put('/products', {
        id,
        name,
        quantity,
        localization,
        category,
    })

    return product
}
