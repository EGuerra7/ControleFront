'use client'

import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from 'lucide-react'
import { Button } from './ui/button'
import { parseAsInteger, useQueryState } from 'nuqs'

interface PaginationProps {
  totalPages: number
}

export default function Pagination({ totalPages }: PaginationProps) {
  const [pages, setPages] = useQueryState('page', parseAsInteger.withDefault(1))

  function handlePlusPages() {
    if (pages < totalPages) {
      setPages(pages + 1)
    }
  }

  function handleFinalPages() {
    setPages(totalPages)
  }

  function handleStartPages() {
    setPages(1)
  }

  function handleMinusPages() {
    if (pages !== 1) {
      setPages(pages - 1)
    }
  }
  return (
    <div className="flex gap-2 pb-5 justify-end">
      <Button onClick={handleStartPages} size={'icon'} variant={'secondary'}>
        <ArrowLeftToLine />
      </Button>
      <Button onClick={handleMinusPages} size={'icon'} variant={'secondary'}>
        <ArrowLeft />
      </Button>
      <div className="bg-secondary flex items-center justify-center py-1 px-4 rounded">
        <span className="text-sm">
          Página {pages} de {totalPages}
        </span>
      </div>
      <Button onClick={handlePlusPages} size={'icon'} variant={'secondary'}>
        <ArrowRight />
      </Button>
      <Button onClick={handleFinalPages} size={'icon'} variant={'secondary'}>
        <ArrowRightToLine />
      </Button>
    </div>
  )
}
