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
  user: z.string().nonempty('O campo usuário é obrigatório.'),
  password: z.string().min(3, 'A senha deve ter pelo menos 3 caracteres.'),
})

export type logInBodySchema = z.infer<typeof LogInBodySchema>
export default function LogIn() {
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitted }, } = useForm<logInBodySchema>({
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
    } catch (error: any) {

      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: 'Error',
          description: `${error.response.data.message}`,
          variant: 'destructive',
          duration: 3000,
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao realizar o log-in.',
          variant: 'destructive',
          duration: 3000,
        })
      }
    }
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

              {isSubmitted && (
                <div className='flex flex-col items-center'>
                  {errors.user && <span className='text-sm text-red-500'>{errors.user.message}</span>}
                  {errors.password && <span className='text-sm text-red-500'>{errors.password.message}</span>}
                </div>
              )}

            </form>
          </>
        )}
      </div>
    </div>
  )
}
