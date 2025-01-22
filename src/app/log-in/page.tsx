'use client'

import { authenticateAdmin } from '@/api/admin/log-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdmin } from '@/hooks/adminContext'
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

      alert('sucess')
    } catch {
      alert('error')
    }

    reset()
  }

  function handleLogout() {
    localStorage.removeItem('admin')
    setAdmin(null)
    alert('logout')
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-10 border p-8 rounded-lg w-96 text-center">
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
          {admin && (
            <Button variant={'destructive'} onClick={handleLogout}>
              <LogOutIcon />
              Sair
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
