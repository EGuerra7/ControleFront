import { LOANSTATUSENUM } from '@/app/relatory/page'

export type LoanStatusType = 'LOAN' | 'COMPLETED'

interface LoanStatusProps {
  status: LoanStatusType
}

const loanStatusMap: Record<LoanStatusType, string> = {
  LOAN: 'Emprestado',
  COMPLETED: 'Completo',
}

export default function LoanStatus({ status }: LoanStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === LOANSTATUSENUM.LOAN && (
        <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
      )}
      {status === LOANSTATUSENUM.COMPLETED && (
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
      )}

      <span>{loanStatusMap[status]}</span>
    </div>
  )
}
