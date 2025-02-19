'use client'

import SelectInput from '@/components/selectInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import CreateCategoryDialog from './createCategoryDialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getLoans, GetLoansResponse } from '@/api/loans/get-loans'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/pagination'
import { searchLoans } from '@/api/loans/search-loans'
import RelatoryTableRow from './relatoryTableRow'
import { LOANSTATUSENUM } from '@/enum/loanStatusEnum'

const SearchProductsSchema = z.object({
  page: z.coerce.number(),
  responsible: z.string().optional(),
  state: z.enum(['LOAN', 'COMPLETED', 'all']).optional(),
})

type searchProductSchema = z.infer<typeof SearchProductsSchema>
export default function Relatory() {
  const [responsible, setResponsible] = useQueryState('responsible', {
    defaultValue: '',
  })
  const [stateRaw, setStateRaw] = useQueryState('state', {
    defaultValue: LOANSTATUSENUM.ALL,
  })

  const state = Object.values(LOANSTATUSENUM).includes(
    stateRaw as LOANSTATUSENUM,
  )
    ? (stateRaw as LOANSTATUSENUM)
    : LOANSTATUSENUM.ALL

  const [pageIndex, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )

  const page = z.coerce.number().parse(pageIndex)

  const statesList = [
    { name: 'Todas', value: 'all' },
    { name: 'Concluídas', value: 'COMPLETED' },
    { name: 'Emprestado', value: 'LOAN' },
  ]

  const { register, handleSubmit, control, reset } =
    useForm<searchProductSchema>({
      resolver: zodResolver(SearchProductsSchema),
      defaultValues: {
        page: page ?? 1,
        responsible: responsible ?? '',
        state: state ?? null,
      },
    })

  const { data: loansData } = useQuery<GetLoansResponse>({
    queryKey: ['loans', page],
    queryFn: () =>
      getLoans({
        page,
      }),
  })

  const loans = loansData?.loans
  const loansMeta = loansData?.meta ?? { totalCount: 0, totalPages: 0 }

  const { data: searchedLoansData } = useQuery<GetLoansResponse | undefined>({
    queryKey: ['loans', page, responsible, state],
    queryFn: async () => {
      if (responsible || state) {
        return await searchLoans({
          page,
          responsible,
          state,
        })
      }
      return undefined
    },
    enabled: !!(responsible || state),
  })

  const searchedLoans = searchedLoansData?.loans
  const searchedLoansMeta = searchedLoansData?.meta

  const displayedLoans = searchedLoans ?? loans
  const displayedMeta = searchedLoansMeta ?? loansMeta

  const handleSearch = ({ responsible, state }: searchProductSchema) => {
    console.log('Submitted Responsible:', responsible)

    if (!responsible && !state) {
      return
    }
    if (responsible) {
      setResponsible(responsible)
    } else {
      setResponsible('')
    }

    if (state && state !== 'all') {
      setStateRaw(state)
    } else {
      setStateRaw(null)
    }

    setPage(1)
  }

  function handleResetFilters() {
    reset()
    setResponsible('')
    setStateRaw(null)
    setPage(1)
  }

  return (
    <main className="w-full flex flex-col gap-5 items-center p-6">
      <h1 className="font-medium text-[25px]">Relatório</h1>
      <div className="flex w-[95%] justify-between">
        <form
          className="flex gap-3 items-center"
          onSubmit={handleSubmit(handleSearch)}
        >
          <Input
            {...register('responsible')}
            placeholder="Procure por responsável..."
          />
          <SelectInput
            control={control}
            {...register('state')}
            items={statesList}
            width="w-[180px]"
            placeholder="Categoria"
          />
          <Button type="submit" variant={'secondary'}>
            <Search size={24} />
          </Button>
          {(responsible !== '' || state !== LOANSTATUSENUM.ALL) && (
            <Button onClick={handleResetFilters} size={'sm'} variant={'ghost'}>
              Limpar filtros
            </Button>
          )}
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'}>Adicionar uma categoria</Button>
          </DialogTrigger>
          <CreateCategoryDialog />
        </Dialog>
      </div>
      <div className="flex flex-col justify-center w-[95%]">
        <Table className="mb-5">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Emprestado há</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedLoans?.map((loan) => {
              return <RelatoryTableRow key={loan.id} loan={loan} />
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <span className="text-sm">
            {displayedMeta?.totalCount > 0
              ? displayedMeta?.totalCount
              : 'Carregando...'}{' '}
            {displayedMeta?.totalCount === 1 ? 'Item' : 'Items'}
          </span>
          <Pagination totalPages={displayedMeta?.totalPages} />
        </div>
      </div>
    </main>
  )
}
