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
import { parseAsInteger, useQueryState } from 'nuqs'
import { getProduct, GetProductResponse } from '@/api/products/get-products'
import { z } from 'zod'
import { getSearchedProducts } from '@/api/products/get-searched-products'

export default function Home() {
  const [name] = useQueryState('name', { defaultValue: '' })
  const [category] = useQueryState('category', { defaultValue: '' })
  const [pageIndex] = useQueryState('page', parseAsInteger.withDefault(1))

  const page = z.coerce.number().parse(pageIndex)

  const { data: productsData } = useQuery<GetProductResponse>({
    queryKey: ['products', page],
    queryFn: () =>
      getProduct({
        page,
      }),
  })

  const products = productsData?.products
  const productsMeta = productsData?.meta ?? { totalCount: 0, totalPages: 0 }

  const { data: searchedProductsData } = useQuery<
    GetProductResponse | undefined
  >({
    queryKey: ['products', page, name, category],
    queryFn: () =>
      name || category
        ? getSearchedProducts({
            page,
            name,
            category,
          })
        : undefined,
    enabled: !!(name || category),
  })

  const searchedProducts = searchedProductsData?.products
  const searchedMeta = searchedProductsData?.meta

  const displayedProducts = searchedProducts ?? products
  const displayedMeta = searchedMeta ?? productsMeta

  return (
    <div className="relative flex flex-col gap-6 items-center w-full flex-1 p-6">
      <h1 className="text-[25px] font-medium">Estoque</h1>
      <div className="flex w-[95%] justify-between">
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

      <div className="flex flex-col justify-center w-[95%]">
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
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={'ghost'} size={'icon'}>
                          <Pencil />
                        </Button>
                      </DialogTrigger>
                      <CreateProductDialog product={product} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <span className="text-sm">
            {displayedMeta?.totalCount > 0
              ? displayedMeta.totalCount
              : 'Carregando...'}{' '}
            {displayedMeta?.totalCount === 1 ? 'Item' : 'Items'}
          </span>
          <Pagination totalPages={displayedMeta?.totalPages} />
        </div>
      </div>
    </div>
  )
}
