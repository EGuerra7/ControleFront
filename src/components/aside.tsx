'use client'

import Image from 'next/image'
import Logo from '@/assets/logoFund.svg'
import {
  CornerDownLeft,
  CornerDownRight,
  Package,
  ReceiptText,
} from 'lucide-react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/adminContext'
import { usePathname } from 'next/navigation'

export function Aside() {
  const { admin } = useAdmin()
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 flex justify-between flex-col bg-gray-100 h-screen px-4 py-6 border-r border-slate-500">
      <div className="flex flex-col items-center gap-16">
        <Link href={'/log-in'}>
          <Image src={Logo} alt="Logo da Fundação" width={50} height={60} />
        </Link>
        <nav className="flex flex-col gap-3">
          <Link href={'/'}>
            <Package
              size={40}
              absoluteStrokeWidth
              className={
                pathname === '/'
                  ? 'text-gray-300'
                  : 'text-zinc-500 transition-colors hover:text-gray-300'
              }
            />
          </Link>
          <Link href={'/loan'}>
            <CornerDownRight
              size={40}
              absoluteStrokeWidth
              className={
                pathname === '/loan'
                  ? 'text-gray-300'
                  : 'text-zinc-500 transition-colors hover:text-gray-300'
              }
            />
          </Link>
          <Link href={'/return'}>
            <CornerDownLeft
              size={40}
              absoluteStrokeWidth
              className={
                pathname === '/return'
                  ? 'text-gray-300'
                  : 'text-zinc-500 transition-colors hover:text-gray-300'
              }
            />
          </Link>
        </nav>
      </div>
      <footer className="mb-5 sm:mb-0">
        {admin && (
          <Link href={'/relatory'}>
            <ReceiptText
              size={40}
              absoluteStrokeWidth
              className={
                pathname === '/relatory'
                  ? 'text-gray-300'
                  : 'text-zinc-500 transition-colors hover:text-gray-300'
              }
            />
          </Link>
        )}
      </footer>
    </aside>
  )
}
