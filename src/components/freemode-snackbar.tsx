import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

export function FreeModeToast() {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: '⚠️ Atenção',
      description:
        'O site está rodando em um servidor gratuito, pode demorar um pouco no primeiro acesso.',
      variant: 'default',
      duration: 6000,
    })
  }, [])

  return null
}
