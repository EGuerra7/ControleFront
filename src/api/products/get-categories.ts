import { api } from '@/lib/axios'

export interface GetCategoriesResponse {
  categories: {
    id: string
    name: string
  }[]
}

export async function getCategories() {
  const response = await api.get<GetCategoriesResponse>('/category')

  return { categories: response.data.categories }
}
