'use client'

import {
  getLoansByState,
  GetLoansByStateResponse,
} from '@/api/loans/get-loans-by-state'
import { searchLoans } from '@/api/loans/search-loans'
import ReturnDialog from '@/app/return/returnDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'

export default function Return() {
  const [responsible, setResponsible] = useQueryState('responsible', {
    defaultValue: '',
  })
  const state = 'LOAN'
  const debouncedResponsible = useDebounce(responsible, 400)

  const { data: loansData } = useQuery<GetLoansByStateResponse>({
    queryKey: ['loansReturn', state],
    queryFn: () =>
      getLoansByState({
        state,
      }),
  })

  const { data: searchedLoansData } = useQuery<
    GetLoansByStateResponse | undefined
  >({
    queryKey: ['loansReturn', debouncedResponsible, state],
    queryFn: () =>
      responsible
        ? searchLoans({
            responsible: debouncedResponsible,
          })
        : undefined,
    enabled: !!debouncedResponsible,
  })

  const loans = searchedLoansData?.loans ?? loansData?.loans

  return (
    <main className="flex flex-col gap-6 p-6 text-center w-[95%]">
      <h1 className="font-medium text-[25px]">Devolução</h1>
      <div className="text-left w-[25%]">
        <Input
          onChange={(e) => setResponsible(e.target.value || null)}
          placeholder="Pesquise o responsável..."
        />
      </div>
      {/* Returns list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loans?.map((loan, index) => {
          const productNames = loans[index].products
            .map((product, i, arr) => {
              if (i === arr.length - 1) {
                return product.product.name
              }
              return product.product.name + ', '
            })
            .join('')

          // Substitui a última vírgula por ' e '
          const finalProductsNames = productNames.replace(/,([^,]*)$/, ' e$1')

          return (
            <Card key={loan.id} className="pt-4 flex flex-col justify-between">
              <CardContent className="flex flex-col gap-2 text-left">
                <span className="text-base">
                  <b className="font-medium">Responsável: </b>
                  {loan.responsible}
                </span>
                <span className="text-base">
                  <b className="font-medium">Produtos: </b> {finalProductsNames}
                </span>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'green'}>Devolver</Button>
                  </DialogTrigger>
                  <ReturnDialog loan={loan} />
                </Dialog>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
