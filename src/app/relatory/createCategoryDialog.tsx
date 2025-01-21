import { createCategory } from '@/api/products/create-category'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const CreateCategoryBodySchema = z.object({
  name: z.string(),
})

type createCategorySchema = z.infer<typeof CreateCategoryBodySchema>
export default function CreateCategoryDialog() {
  const { register, handleSubmit, reset } = useForm<createCategorySchema>({
    resolver: zodResolver(CreateCategoryBodySchema),
  })

  async function handleCreateCategory(data: createCategorySchema) {
    await createCategory({
      name: data.name
    })

    alert('Categoria criada')
    reset()
  }

  return (
    <DialogContent className="flex flex-col gap-7">
      <DialogHeader>
        <DialogTitle className="font-medium text-lg">
          Adicionar categoria
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(handleCreateCategory)}
        className="flex flex-col gap-7"
      >
        <Input {...register('name')} placeholder="Categoria" />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" variant={'green'}>
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
