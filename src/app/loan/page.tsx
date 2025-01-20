'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CircleX, Plus } from 'lucide-react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SelectCombobox from '@/components/selectCombobox'
import { useQuery } from '@tanstack/react-query'
import {
  getAllProduct,
  GetAllProductResponse,
} from '@/api/products/get-all-products'
import { createLoan } from '@/api/loans/create-loan'

const CreateLoanFormSchema = z.object({
  responsible: z.string().min(3),
  products: z.array(
    z.object({
      id: z.string(),
      loan_quantity: z.number(),
      return_quantity: z.number().default(1),
    }),
  ),
})

export type createLoanFormSchema = z.infer<typeof CreateLoanFormSchema>

export default function Loan() {
  const { control, register, handleSubmit, reset } =
    useForm<createLoanFormSchema>({
      resolver: zodResolver(CreateLoanFormSchema),
      defaultValues: {
        responsible: '',
        products: [{ id: '', loan_quantity: 1, return_quantity: 1 }],
      },
    })

  function handleAddProduct() {
    append({ id: '', loan_quantity: 1, return_quantity: 1 })
  }

  function handleRemoveProduct(index: number) {
    remove(index)
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  })

  async function handleCreateLoan(loan: createLoanFormSchema) {
    await createLoan({
      responsible: loan.responsible,
      products: loan.products,
    })

    alert('Empréstimo criado')
    reset()
  }

  const { data: productsList } = useQuery<GetAllProductResponse>({
    queryKey: ['products'],
    queryFn: getAllProduct,
  })

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="border-2 rounded py-8 px-12 flex flex-col gap-7 text-center ">
          <h1 className=" text-lg font-medium">Empréstimo</h1>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleCreateLoan)}
          >
            <div className="flex flex-col gap-5">
              <Input {...register('responsible')} placeholder="Responsável" />
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="flex gap-4 items-stretch">
                      <SelectCombobox
                        name={`products.${index}.id`}
                        control={control}
                        items={productsList?.products ?? []}
                      />
                      <Input
                        {...register(`products.${index}.loan_quantity`, {
                          valueAsNumber: true,
                        })}
                        className="text-center"
                        size={1}
                        placeholder="Qtd."
                      />
                      <Button
                        className="text-gray-600 font-normal"
                        type="button"
                        variant={'ghost'}
                        size={'sm'}
                        disabled={fields.length === 1}
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <CircleX />
                      </Button>
                    </div>
                  )
                })}
              </div>
              <Button
                type="button"
                onClick={handleAddProduct}
                variant={'outline'}
                size={'sm'}
              >
                <Plus />
              </Button>
            </div>

            <Button type="submit" variant={'secondary'}>
              Confirmar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
