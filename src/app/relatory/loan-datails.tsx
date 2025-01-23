import { getLoansById } from '@/api/loans/get-loan-by-id'
import LoanStatus from '@/components/loan-status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

interface LoanDetailsProps {
  loanId: string
  open: boolean
}

export default function LoanDetails({ loanId, open }: LoanDetailsProps) {
  const { data: loanData } = useQuery({
    queryKey: ['loans', loanId],
    queryFn: () => getLoansById({ loanId }),
    enabled: open,
  })

  const loan = loanData?.loan

  if (!open || !loan) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do empréstimo</DialogTitle>
        <DialogDescription>Pedido: {loanId}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-10">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Responsável</TableCell>
              <TableCell className="flex justify-end">
                {loan.responsible}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Realizado em</TableCell>
              <TableCell className="flex justify-end">
                {format(loan.created_at, 'dd/MM/yyyy', {
                  locale: ptBR,
                })}{' '}
                às{' '}
                {format(loan.created_at, 'HH:mm', {
                  locale: ptBR,
                })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell className="flex justify-end">
                <LoanStatus status={loan.state} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Produto</TableHead>
              <TableHead className="text-center w-[25%]">Emprestado</TableHead>
              <TableHead className="text-center w-[25%]">Retorno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loan.products.map((product) => {
              return (
                <TableRow key={product.product.id}>
                  <TableCell className="text-left">
                    {product.product.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.loan_quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.return_quantity}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
