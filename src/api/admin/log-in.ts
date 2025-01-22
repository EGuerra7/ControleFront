import { api } from '@/lib/axios'

export interface authenticateAdminBody {
  user: string
  password: string
}

export async function authenticateAdmin({
  user,
  password,
}: authenticateAdminBody) {
  const admin = await api.post('/authenticate', {
    user,
    password,
  })

  return admin
}
