import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import SelectInput from './selectInput'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'

const SearchProductsSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
})

type searchProductSchema = z.infer<typeof SearchProductsSchema>

export default function SearchProducts() {
  const [name, setName] = useQueryState('name', { defaultValue: '' })
  const [category, setCategory] = useQueryState('category', {
    defaultValue: '',
  })

  const items = [
    { name: 'Todas', value: 'all' },
    { name: 'Papelaria', value: 'Stationery' },
    { name: 'Eletrônicos', value: 'Eletronics' },
    { name: 'Marcenaria', value: 'Marcenaria' },
  ]

  const { register, handleSubmit, control } = useForm<searchProductSchema>({
    resolver: zodResolver(SearchProductsSchema),
    defaultValues: {
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
  }
  return (
    <form className="flex gap-3" onSubmit={handleSubmit(handleSearch)}>
      <Input {...register('name')} placeholder="Procure por nome..." />
      <SelectInput
        control={control}
        {...register('category')}
        items={items}
        width="w-[180px]"
        placeholder="Categoria"
      />
      <Button type="submit" variant={'secondary'}>
        <Search size={24} />
      </Button>
    </form>
  )
}
