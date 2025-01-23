'use client'

import { authenticateAdmin } from '@/api/admin/log-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdmin } from '@/hooks/adminContext'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOutIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const LogInBodySchema = z.object({
  user: z.string(),
  password: z.string().min(3),
})

export type logInBodySchema = z.infer<typeof LogInBodySchema>
export default function LogIn() {
  const { toast } = useToast()

  const { register, handleSubmit, reset } = useForm<logInBodySchema>({
    resolver: zodResolver(LogInBodySchema),
  })

  const { admin, setAdmin } = useAdmin()

  async function handleLogIn(data: logInBodySchema) {
    try {
      const response = await authenticateAdmin({
        user: data.user,
        password: data.password,
      })

      const adminResponse = response.data

      localStorage.setItem('admin', JSON.stringify(admin))
      setAdmin(adminResponse)

      toast({
        title: 'Sucesso',
        description: 'Você está logado como um administrador!',
        variant: 'green',
        duration: 3000,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Usuário ou senha inválidos.',
        variant: 'destructive',
        duration: 3000,
      })
    }

    reset()
  }

  function handleLogout() {
    localStorage.removeItem('admin')
    setAdmin(null)
    toast({
      title: 'Saindo...',
      duration: 3000,
    })
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex flex-col gap-10 border p-8 rounded-lg w-96 text-center">
        {admin ? (
          <div className="flex justify-between items-center">
            <span className="text-sm w-[50%">
              Você está logado como{' '}
              <b className="text-emerald-500">Administrador!</b>
            </span>
            <Button variant={'destructive'} onClick={handleLogout}>
              <LogOutIcon />
              Sair
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-medium text-lg">Entre como administrador</h1>

            <form
              onSubmit={handleSubmit(handleLogIn)}
              className="flex flex-col gap-5 items-center justify-center"
            >
              <Input placeholder="Usuário" {...register('user')} />
              <Input placeholder="Senha" {...register('password')} />

              <Button type="submit" className="w-full mt-4">
                Entrar
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
