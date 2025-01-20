import { z } from 'zod'
import SelectInput from './selectInput'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'

import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client-provider'
import { Products } from '@/api/products/get-products'
import { useEffect, useState } from 'react'
import { editProduct } from '@/api/products/edit-product'
import { createProduct } from '@/api/products/create-product'

const CreateProductBodySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  category: z.string(),
  quantity: z.coerce.number(),
  localization: z.string(),
})

type createProductSchema = z.infer<typeof CreateProductBodySchema>

interface CreateProductDialogProps {
  product?: createProductSchema
}

export default function CreateProductDialog({
  product,
}: CreateProductDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false)

  const { register, handleSubmit, control, reset } =
    useForm<createProductSchema>({
      resolver: zodResolver(CreateProductBodySchema),
      defaultValues: product,
    })

  useEffect(() => {
    if (product) {
      setIsEditMode(true)
      reset(product)
    } else {
      setIsEditMode(false)
      reset() // Reseta para valores padrão quando em modo de criação
    }
  }, [product, reset])

  const items = [
    { name: 'Papelaria', value: 'Stationery' },
    { name: 'Eletrônicos', value: 'Eletronics' },
    { name: 'Marcenaria', value: 'Marcenaria' },
  ]

  async function saveProductApi(data: createProductSchema): Promise<Products> {
    if (isEditMode && product) {
      const response = await editProduct({
        id: data.id!,
        name: data.name,
        category: data.category,
        localization: data.localization,
        quantity: data.quantity,
      })

      return response
    } else {
      const response = await createProduct({
        name: data.name,
        category: data.category,
        localization: data.localization,
        quantity: data.quantity,
      })
      return response
    }
  }

  function useCreateProduct() {
    return useMutation<Products, Error, createProductSchema>({
      mutationFn: saveProductApi,
      onSuccess: (product) => {
        if (isEditMode) {
          queryClient.setQueryData<Products[]>(['products'], (oldProducts) => {
            if (!oldProducts) return []

            return oldProducts.map((p) => (p.id === product.id ? product : p))
          })
          alert('Produto editado com sucesso!')
        } else {
          queryClient.setQueryData<Products[]>(['products'], (oldProducts) => {
            return oldProducts ? [...oldProducts, product] : [product]
          })
          alert('Produto criado com sucesso!')
        }
      },
      onError: (error) => {
        console.error('Erro ao criar o produto:', error.message)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
      },
    })
  }

  const { mutate } = useCreateProduct()

  const handleCreateProduct = (data: createProductSchema) => {
    mutate(data)
  }

  return (
    <DialogContent className="max-w-2xl max-h-[50%] h-full w-full px-20 py-5">
      <DialogHeader>
        {isEditMode ? (
          <DialogTitle className="text-center">Editar produto</DialogTitle>
        ) : (
          <DialogTitle className="text-center">Adicionar produto</DialogTitle>
        )}
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateProduct)}
      >
        <div className="flex flex-col gap-3">
          <div>
            <Label className="mb-1" htmlFor="name">
              Nome:
            </Label>
            <Input {...register('name')} name="name" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <Label className="mb-1">Categoria:</Label>
              <SelectInput
                control={control}
                {...register('category')}
                items={items}
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor="quantity">
                Quantidade:
              </Label>
              <Input {...register('quantity')} name="quantity" type="text" />
            </div>
          </div>
          <div>
            <Label className="mb-1" htmlFor="localization">
              Localização:
            </Label>
            <Input
              {...register('localization')}
              name="localization"
              type="text"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" size={'lg'}>
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
