import { api } from "@/lib/axios";

export interface GetProductsQuery {
    pageIndex: number | null
    name: string | null,
    category: string | null,
}

export interface GetProductResponse {
    id: string,
    name: string,
    quantity: number,
    localization: string,
    category: string,
}

export async function getProduct({ pageIndex, name, category }: GetProductsQuery) {
    const response = await api.get<GetProductResponse>('/products', {
        params: {
            pageIndex,
            name,
            category
        }
    })

    return response.data
}