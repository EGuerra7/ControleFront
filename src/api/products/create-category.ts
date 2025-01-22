import { api } from '@/lib/axios'

export interface CreateCategoryBody {
  name: string
}

export async function createCategory({ name }: CreateCategoryBody) {
  const category = await api.post('/category', {
    name,
  })

  return category
}
