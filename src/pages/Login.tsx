import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Compass, Gem, Landmark, LockKeyhole, LogIn, Mail, Puzzle, ShieldCheck, Sparkles, UserPlus, Users, X } from 'lucide-react'
import { getProfileRole, supabase } from '../lib/supabase'
import dinosaurImage from '../images/dinossauro.png'
import egyptImage from '../images/egito.png'
import carriageImage from '../images/caruagem.png'

type AccountRole = 'student' | 'teacher'
type AuthMode = 'login' | 'register'

const benefits = [
  { title: 'APRENDA BRINCANDO', text: 'Descubra curiosidades reais sobre ciência, história e cultura.', icon: BookOpen },
  { title: 'RESOLVA ENIGMAS', text: 'Desafios inteligentes para testar sua lógica.', icon: Puzzle },
  { title: 'EXPLORE AMBIENTES ÚNICOS', text: 'Salas temáticas cheias de segredos.', icon: Gem },
  { title: 'VIVA UMA AVENTURA INCRÍVEL', text: 'Uma experiência imersiva e inesquecível.', icon: Users },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [role, setRole] = useState<AccountRole>('student')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [remember, setRemember] = useState(true)
  const navigate = useNavigate()
  const registering = authMode === 'register'

  function openAuth(mode: AuthMode) {
    setAuthMode(mode)
    setError('')
    setMessage('')
    setAuthOpen(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!supabase) {
      if (registering) {
        setError('O cadastro exige que o Supabase esteja configurado.')
        return
      }
      if (role === 'teacher') {
        setError('A área do professor exige uma conta autenticada como professor.')
        return
      }
      navigate('/caso')
      return
    }

    if (registering) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role, full_name: email.split('@')[0] } },
      })
      if (signUpError) {
        setError(signUpError.message)
        return
      }
      setMessage('Cadastro iniciado. Verifique seu e-mail para confirmar a conta.')
      setAuthMode('login')
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError || !data.user) {
      setError(signInError?.message ?? 'Não foi possível entrar nesta conta.')
      return
    }

    const accountRole = await getProfileRole(data.user.id)
    if (accountRole !== role) {
      await supabase.auth.signOut()
      setError(accountRole === 'teacher'
        ? 'Esta conta está cadastrada como professor. Selecione “Sou professor” para entrar.'
        : 'Esta conta não tem perfil de professor. Selecione “Sou aluno” para entrar.')
      return
    }
    navigate(accountRole === 'teacher' ? '/professor' : '/caso')
  }

  async function resetPassword() {
    setError('')
    setMessage('')
    if (!email) {
      setError('Digite seu e-mail para receber o link de recuperação.')
      return
    }
    if (!supabase) {
      setError('A recuperação de senha exige que o Supabase esteja configurado.')
      return
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
    if (resetError) setError(resetError.message)
    else setMessage('Enviamos um link de recuperação para seu e-mail.')
  }

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <img className="landing-hero-image" src={dinosaurImage} alt="Esqueleto de dinossauro em uma galeria do museu" />
        <div className="landing-hero-shade" />
        <div className="landing-logo" aria-label="Museu, o jogo">
          <Landmark className="landing-logo-icon" size={35} strokeWidth={1.8} />
          <span className="landing-logo-title">MUSEU</span>
          <span className="landing-logo-subtitle">O JOGO</span>
        </div>

        <article className="landing-side-card landing-side-left">
          <Landmark size={34} strokeWidth={1.6} />
          <h2>EXPLORE<br />O MUSEU</h2>
          <p>Viva uma aventura única em um museu cheio de mistérios, histórias e descobertas. Resolva enigmas, explore exposições e desvende segredos do passado.</p>
          <i />
        </article>
        <article className="landing-side-card landing-side-right">
          <Compass size={36} strokeWidth={1.5} />
          <h2>DESCUBRA<br />SEGREDOS</h2>
          <p>Interaja com o ambiente, encontre pistas, complete desafios e aprenda sobre a história, a ciência e a cultura de forma divertida e imersiva.</p>
          <i />
        </article>
        <div className="landing-hero-caption"><Sparkles size={14} /> UMA AVENTURA PARA TODAS AS IDADES</div>
      </section>

      <section className="landing-benefits">
        <div className="landing-section-title"><span /> <h2>POR QUE JOGAR?</h2> <span /></div>
        <div className="landing-benefit-grid">
          {benefits.map(({ title, text, icon: Icon }) => (
            <article className="landing-benefit" key={title}>
              <div className="landing-benefit-icon"><Icon size={30} strokeWidth={1.6} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-gallery">
        <div className="landing-section-title"><span /> <h2>IMAGENS DO JOGO</h2> <span /></div>
        <div className="landing-gallery-grid">
          <img src={dinosaurImage} alt="Esqueleto de dinossauro exposto no museu" />
          <img src={egyptImage} alt="Galeria egípcia com estátuas e sarcófago" />
          <img src={carriageImage} alt="Carruagem em uma galeria histórica" />
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-rule"><span /><Landmark size={31} /><span /></div>
        <h2>PRONTO PARA EXPLORAR?</h2>
        <p>Crie sua conta, faça login e embarque agora nessa aventura no museu!</p>
        <div className="landing-cta-actions">
          <button type="button" onClick={() => openAuth('login')}><LogIn size={20} /> Entrar</button>
          <button type="button" onClick={() => openAuth('register')}><UserPlus size={20} /> Criar conta</button>
        </div>
      </section>

      {authOpen && (
        <div className="landing-auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false) }}>
          <section className="landing-auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="landing-auth-close" type="button" aria-label="Fechar" onClick={() => setAuthOpen(false)}><X size={19} /></button>
            <div className="eyebrow">AUTENTICAÇÃO DO GUARDIÃO</div>
            <h2 id="auth-title">{registering ? 'Crie seu acesso' : 'Seu turno começa aqui'}</h2>
            <p className="login-intro">{registering ? 'Cadastre-se para entrar no museu e investigar o caso.' : 'Identifique-se e entre no museu. Temos um mistério esperando por você.'}</p>
            <div className="role-switch" aria-label="Tipo de acesso">
              <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>Sou aluno</button>
              <button type="button" className={role === 'teacher' ? 'active' : ''} onClick={() => setRole('teacher')}>Sou professor</button>
            </div>
            <form onSubmit={submit} className="login-form">
              <label>{role === 'student' ? 'E-mail ou matrícula' : 'E-mail institucional'}
                <span className="field-wrap"><Mail size={15} /><input autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@escola.edu.br" required /></span>
              </label>
              <label>Senha
                <span className="field-wrap"><LockKeyhole size={15} /><input autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" minLength={6} required /></span>
              </label>
              {!registering && <div className="login-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Lembrar meu acesso</span></label><button type="button" className="text-action" onClick={resetPassword}>Esqueci minha senha</button></div>}
              {error && <div className="error" role="alert">{error}</div>}
              {message && <div className="login-message" role="status">{message}</div>}
              <button className="primary full login-submit" type="submit">{registering ? <><UserPlus size={16} /> Criar minha conta</> : <><LogIn size={16} /> Iniciar meu turno</>}</button>
            </form>
            <p className="register-prompt">{registering ? 'Já tem uma conta?' : 'Primeira noite por aqui?'} <button type="button" className="text-action" onClick={() => openAuth(registering ? 'login' : 'register')}>{registering ? 'Entrar' : 'Registrar-se'} <ArrowRight size={12} /></button></p>
            <p className="landing-auth-note"><ShieldCheck size={14} /> Seu progresso fica salvo durante a investigação.</p>
          </section>
        </div>
      )}
    </main>
  )
}

