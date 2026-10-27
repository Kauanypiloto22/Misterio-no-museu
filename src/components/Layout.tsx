import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FileSearch, LayoutDashboard, LogOut, Map, Menu, Shield, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getProfileRole, supabase } from '../lib/supabase'

export function Layout() {
  const [open, setOpen] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    async function loadRole() {
      if (!supabase) return
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) return
      const role = await getProfileRole(data.user.id)
      if (active) setIsTeacher(role === 'teacher')
    }
    void loadRole()
    return () => { active = false }
  }, [])

  const links = [
    { to: '/caso', label: 'Caso', icon: FileSearch },
    { to: '/museu', label: 'Museu', icon: Map },
    { to: '/conclusao', label: 'Conclusão', icon: Shield },
    ...(isTeacher ? [{ to: '/professor', label: 'Professor', icon: LayoutDashboard }] : []),
  ]

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setIsTeacher(false)
    navigate('/')
    setOpen(false)
  }

  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/caso"><span className="brand-mark">RM</span><span>O Roubo no Museu</span></Link>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'nav open' : 'nav'}>
        {links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={17}/>{label}</NavLink>)}
        <button className="nav-link logout" onClick={logout}><LogOut size={17}/>Sair</button>
      </nav>
    </header>
    <main className="main"><Outlet /></main>
  </div>
}

export function PageHeader({eyebrow, title, text}:{eyebrow:string,title:string,text?:string}) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{text && <p>{text}</p>}</div><div className="profile-chip"><UserRound size={17}/><span>Aluno</span></div></div>
}

export function Progress({value}:{value:number}) { return <div className="progress"><div style={{width:`${value}%`}}/></div> }
