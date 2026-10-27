import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, KeyRound, Send, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { completeFinalInvestigation, getMuseumProgress, isInvestigationComplete, MUSEUM_PROGRESS_EVENT, type MuseumProgress } from '../lib/museumProgress'

const methods = [
  { id: 'service-vehicle', text: 'A peça foi acomodada em um prisma retangular de base 60 cm² e levada em um veículo de serviço pela rota lateral.' },
  { id: 'main-entrance', text: 'A peça saiu inteira pela entrada principal dentro de um tubo cilíndrico.' },
  { id: 'royal-carriage', text: 'A peça foi transportada na carruagem da Galeria Real durante a exposição.' },
]

const suspects = [
  { id: 'curador', name: 'Curador', base: '50 cm²' },
  { id: 'seguranca', name: 'Segurança', base: '55 cm²' },
  { id: 'restaurador', name: 'Restaurador', base: '10 × 6 = 60 cm²' },
  { id: 'guia', name: 'Guia', base: '72 cm²' },
]

export default function Conclusion() {
  const [progress, setProgress] = useState<MuseumProgress>(getMuseumProgress)
  const [method, setMethod] = useState('')
  const [suspect, setSuspect] = useState('')
  const [feedback, setFeedback] = useState<'wrong' | 'correct' | null>(null)

  useEffect(() => {
    const refresh = () => setProgress(getMuseumProgress())
    window.addEventListener(MUSEUM_PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(MUSEUM_PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  if (!isInvestigationComplete(progress)) return <Navigate to="/museu" replace />

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (method === 'service-vehicle' && suspect === 'restaurador') {
      setProgress(completeFinalInvestigation())
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="ÚLTIMA ETAPA"
        title="Reúna as evidências"
        text="As quatro salas estão concluídas. Use as medidas e pistas para deduzir como a peça saiu e quem tinha o recipiente compatível."
      />
      <div className="final-clue-summary">
        <div><KeyRound size={18} /><span><b>Base necessária</b>60 cm²</span></div>
        <div><ShieldCheck size={18} /><span><b>Rota</b>Área de serviço, sem entrada principal</span></div>
        <div><CheckCircle2 size={18} /><span><b>Formato</b>Prisma retangular</span></div>
      </div>
      <form className="final-investigation-grid" onSubmit={submit}>
        <fieldset className="final-investigation-card">
          <legend>Como a peça foi retirada?</legend>
          <p>Considere as pistas sobre a entrada, o recipiente e o veículo.</p>
          <div className="final-choice-list">
            {methods.map((option) => (
              <label className={method === option.id ? 'final-choice selected' : 'final-choice'} key={option.id}>
                <input type="radio" name="method" value={option.id} checked={method === option.id} onChange={() => { setMethod(option.id); setFeedback(null) }} />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="final-investigation-card">
          <legend>Quem tinha o recipiente compatível?</legend>
          <p>Compare a área necessária da base com as medidas de cada suspeito.</p>
          <div className="final-suspects">
            {suspects.map((option) => (
              <label className={suspect === option.id ? 'final-suspect selected' : 'final-suspect'} key={option.id}>
                <input type="radio" name="suspect" value={option.id} checked={suspect === option.id} onChange={() => { setSuspect(option.id); setFeedback(null) }} />
                <b>{option.name}</b><span>Base: {option.base}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {feedback === 'wrong' && <p className="final-investigation-feedback wrong" role="alert">Essa hipótese não combina com todas as pistas. Revise a rota de serviço e a área de 60 cm².</p>}
        {feedback === 'correct' && (
          <div className="final-investigation-feedback correct" role="status">
            <CheckCircle2 size={21} />
            <div><b>Dedução correta: foi o Restaurador.</b><span>O recipiente prismático tinha base de 10 × 6 = 60 cm². A peça seguiu pelo corredor de serviço em um veículo, sem passar pela entrada principal.</span></div>
          </div>
        )}
        {feedback !== 'correct' && <button className="primary final-investigation-submit" type="submit" disabled={!method || !suspect}><Send size={17} />Apresentar dedução</button>}
        {feedback === 'correct' && progress.finalCompleted && <div className="final-case-complete"><CheckCircle2 size={17} /> Caso desvendado e progresso salvo.</div>}
      </form>
    </>
  )
}
