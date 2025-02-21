'use client'

import { useEffect, useState } from 'react'

export function FreeModeAlert() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const alreadyShown = localStorage.getItem('freeModeAlert')

    if (!alreadyShown) {
      localStorage.setItem('freeModeAlert', 'true')
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-white p-4 rounded-md shadow-lg max-w-xs text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-lg text-yellow-600">⚠️ Atenção!</h2>
        <p className="mt-2 text-base leading-tight text-gray-700">
          O site está rodando em um servidor gratuito, pode demorar um pouco no
          primeiro acesso.
        </p>
      </div>
    </div>
  )
}
