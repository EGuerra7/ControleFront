import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import SelectInput from './selectInput'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useQuery } from '@tanstack/react-query'
import {
  getCategories,
  GetCategoriesResponse,
} from '@/api/products/get-categories'

const SearchProductsSchema = z.object({
  page: z.coerce.number(),
  name: z.string().optional(),
  category: z.string().optional(),
})

type searchProductSchema = z.infer<typeof SearchProductsSchema>

export default function SearchProducts() {
  const [name, setName] = useQueryState('name', { defaultValue: '' })
  const [pages, setPages] = useQueryState('page', parseAsInteger.withDefault(1))
  const [category, setCategory] = useQueryState('category', {
    defaultValue: '',
  })

  const { data: categoriesListData } = useQuery<GetCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categoriesList = categoriesListData?.categories || []

  const categories = categoriesList.map((category) => ({
    name: category.name,
    value: category.name,
  }))

  const { register, handleSubmit, control, reset } =
    useForm<searchProductSchema>({
      resolver: zodResolver(SearchProductsSchema),
      defaultValues: {
        page: pages ?? 1,
        name: name ?? '',
        category: category ?? '',
      },
    })

  const handleSearch = ({ name, category }: searchProductSchema) => {
    if (!name && !category) {
      return null
    }

    if (name) {
      setName(name)
    } else {
      setName('')
    }

    if (category && category !== 'all') {
      setCategory(category)
    } else {
      setCategory(null)
    }

    setPages(1)
  }

  function handleResetFilters() {
    reset()
    setName('')
    setCategory(null)
    setPages(1)
  }

  return (
    <form
      className="flex gap-3 items-center"
      onSubmit={handleSubmit(handleSearch)}
    >
      <Input {...register('name')} placeholder="Procure por nome..." />
      <SelectInput
        control={control}
        {...register('category')}
        items={categories}
        width="w-[180px]"
        placeholder="Categoria"
      />
      <Button type="submit" variant={'secondary'}>
        <Search size={24} />
      </Button>

      {(name !== '' || category !== '') && (
        <Button onClick={handleResetFilters} size={'sm'} variant={'ghost'}>
          Limpar filtros
        </Button>
      )}
    </form>
  )
}
