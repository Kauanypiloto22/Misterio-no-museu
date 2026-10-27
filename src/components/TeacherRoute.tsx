import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getProfileRole, supabase } from '../lib/supabase'
import Teacher from '../pages/Teacher'

export default function TeacherRoute() {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true

    async function checkAccess() {
      if (!supabase) {
        if (active) setAllowed(false)
        return
      }
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        if (active) setAllowed(false)
        return
      }
      const role = await getProfileRole(data.user.id)
      if (active) setAllowed(role === 'teacher')
    }

    void checkAccess()
    return () => { active = false }
  }, [])

  if (allowed === null) return <div className="auth-route-loading" role="status">Verificando acesso…</div>
  if (!allowed) return <Navigate to="/caso" replace />
  return <Teacher />
}
