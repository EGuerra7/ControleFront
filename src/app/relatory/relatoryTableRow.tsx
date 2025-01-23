'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { ScrollText } from 'lucide-react'
import { useState } from 'react'
import LoanDetails from './loan-datails'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import LoanStatus from '@/components/loan-status'
import { Loan } from '@/api/loans/get-loans'

export interface RelatoryTableRowProps {
  loan: Loan
}

export default function RelatoryTableRow({ loan }: RelatoryTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const productNames = loan.products
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
    <TableRow key={loan.id}>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <ScrollText />
            </Button>
          </DialogTrigger>
          <LoanDetails loanId={loan.id} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell>{loan.responsible}</TableCell>
      <TableCell className="max-w-50 mr-1" key={loan.id}>
        <span>{finalProductsNames}</span>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(loan.created_at, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <LoanStatus status={loan.state} />
      </TableCell>
    </TableRow>
  )
}
