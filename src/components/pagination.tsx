'use client'

import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export default function Pagination() {
  const [pages, setPages] = useState(1)

  function handlePlusPages() {
    if (pages < 10) {
      setPages(pages + 1)
    }
  }

  function handleFinalPages() {
    setPages(10)
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
        <span className="text-sm">Página {pages} de 10</span>
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
