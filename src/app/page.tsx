'use client'

import CreateProductDialog from '@/components/createProductDialog'
import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import SearchProducts from '@/components/searchProducts'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { getProduct, Products } from '@/api/get-products'
import { z } from 'zod'
import { getSearchedProducts } from '@/api/get-searched-products'

export default function Home() {
  const [name] = useQueryState('name', { defaultValue: '' })
  const [category] = useQueryState('category', { defaultValue: '' })
  const [pageIndex] = useQueryState('page', { defaultValue: '1' })

  const page = z.coerce.number().parse(pageIndex)

  const { data: products } = useQuery<Products[]>({
    queryKey: ['products', page],
    queryFn: () =>
      getProduct({
        page,
      }),
  })

  const { data: SearchedProducts } = useQuery<Products[] | undefined>({
    queryKey: ['products', name, category],
    queryFn: () =>
      name || category
        ? getSearchedProducts({
            name,
            category,
          })
        : [],
    enabled: !!(name || category),
  })

  const displayedProducts = SearchedProducts ?? products

  return (
    <div className="relative flex flex-col gap-6 items-center w-full flex-1 p-6">
      <h1 className="text-[25px] font-medium">Estoque</h1>
      <div className="flex w-[90%] justify-between">
        <div>
          <SearchProducts />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'}>Adicionar um produto</Button>
          </DialogTrigger>
          <CreateProductDialog />
        </Dialog>
      </div>

      <div className="flex flex-col justify-center w-[90%]">
        <Table className="mb-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-base">Produto</TableHead>
              <TableHead className="text-base">Categoria</TableHead>
              <TableHead className="text-base">Qtd.</TableHead>
              <TableHead className="text-base">Localização</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProducts?.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.localization}</TableCell>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'}>
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Pagination />
      </div>
    </div>
  )
}
