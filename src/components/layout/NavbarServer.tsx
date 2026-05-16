import { createClient } from '@/lib/supabase/server'
import Navbar from './Navbar'

export default async function NavbarServer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const authUser = user
    ? {
        email: user.email ?? '',
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
      }
    : null

  return <Navbar authUser={authUser} />
}
