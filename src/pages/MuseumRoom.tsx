import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2, KeyRound, LockKeyhole, Search, X } from 'lucide-react'
import egyptImage from '../images/egito.png'
import medievalImage from '../images/medieval.png'
import carriageImage from '../images/caruagem.png'
import dinosaurImage from '../images/dinossauro.png'
import { museumRooms, roomOrder, type RoomId, type MuseumHotspot } from '../data/museumGame'
import { completeHotspot, getMuseumProgress, isRoomComplete, isRoomUnlocked, MUSEUM_PROGRESS_EVENT, type MuseumProgress } from '../lib/museumProgress'

const roomImages: Record<RoomId, string> = {
  antiguidades: egyptImage,
  expedicao: medievalImage,
  'galeria-real': carriageImage,
  fosseis: dinosaurImage,
}

type ImageBounds = { left: number; top: number; width: number; height: number }
type Feedback = { correct: boolean; text: string; clue?: string }

function parseAnswer(value: string): number | undefined {
  const match = value.trim().replace(',', '.').match(/[+-]?\d+(?:\.\d+)?/)
  if (!match) return undefined
  const answer = Number(match[0])
  return Number.isFinite(answer) ? answer : undefined
}

export default function MuseumRoom() {
  const { room: roomParam } = useParams()
  if (!roomParam || !(roomParam in museumRooms)) return <Navigate to="/museu" replace />
  return <InteractiveRoom roomId={roomParam as RoomId} />
}

function InteractiveRoom({ roomId }: { roomId: RoomId }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [bounds, setBounds] = useState<ImageBounds>({ left: 0, top: 0, width: 100, height: 100 })
  const [progress, setProgress] = useState<MuseumProgress>(getMuseumProgress)
  const [selectedHotspot, setSelectedHotspot] = useState<MuseumHotspot | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const room = museumRooms[roomId]
  const solved = progress.rooms[roomId].completedHotspots
  const roomComplete = isRoomComplete(progress, roomId)

  const measureImage = useCallback(() => {
    const scene = sceneRef.current
    const image = imageRef.current
    if (!scene || !image?.naturalWidth || !image.naturalHeight) return
    const { width: sceneWidth, height: sceneHeight } = scene.getBoundingClientRect()
    if (!sceneWidth || !sceneHeight) return
    const scale = Math.max(sceneWidth / image.naturalWidth, sceneHeight / image.naturalHeight)
    const imageWidth = image.naturalWidth * scale
    const imageHeight = image.naturalHeight * scale
    setBounds({
      left: ((sceneWidth - imageWidth) / 2 / sceneWidth) * 100,
      top: ((sceneHeight - imageHeight) / 2 / sceneHeight) * 100,
      width: (imageWidth / sceneWidth) * 100,
      height: (imageHeight / sceneHeight) * 100,
    })
  }, [])

  useLayoutEffect(() => {
    measureImage()
    const scene = sceneRef.current
    if (!scene) return
    const observer = new ResizeObserver(measureImage)
    observer.observe(scene)
    return () => observer.disconnect()
  }, [measureImage, roomId])

  useEffect(() => {
    const refresh = () => setProgress(getMuseumProgress())
    window.addEventListener(MUSEUM_PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(MUSEUM_PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (!selectedHotspot) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChallenge()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedHotspot])

  if (!isRoomUnlocked(progress, roomId)) return <Navigate to="/museu" replace />

  function openChallenge(hotspot: MuseumHotspot) {
    setSelectedHotspot(hotspot)
    setAnswer('')
    setFeedback(solved.includes(hotspot.id)
      ? { correct: true, text: 'Esta descoberta já foi registrada.', clue: progress.rooms[roomId].clues[hotspot.id] ?? hotspot.clue }
      : null)
  }

  function closeChallenge() {
    setSelectedHotspot(null)
    setAnswer('')
    setFeedback(null)
  }

  function verifyAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedHotspot) return
    const numericAnswer = parseAnswer(answer)
    if (numericAnswer !== selectedHotspot.answer) {
      setFeedback({ correct: false, text: 'Ainda não. Confira as medidas e tente novamente.' })
      return
    }
    const updated = completeHotspot(roomId, selectedHotspot.id, answer.trim())
    setProgress(updated)
    setFeedback({ correct: true, text: 'Resposta correta. Nova pista registrada.', clue: selectedHotspot.clue })
  }

  const roomIndex = roomOrder.indexOf(roomId)
  const nextRoom = roomOrder[roomIndex + 1]

  return (
    <>
      <main className="museum-room-fullscreen" aria-label={room.title}>
        <div className="museum-room-scene" ref={sceneRef}>
          <img ref={imageRef} src={roomImages[roomId]} alt={room.imageAlt} onLoad={measureImage} />
          <div
            className="museum-hotspots"
            style={{ left: `${bounds.left}%`, top: `${bounds.top}%`, width: `${bounds.width}%`, height: `${bounds.height}%` }}
          >
            {room.hotspots.map((hotspot, index) => {
              const completed = solved.includes(hotspot.id)
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  className={`museum-hotspot${completed ? ' completed' : ''}`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  aria-label={`${hotspot.label}${completed ? ', pista descoberta' : ', investigar'}`}
                  onClick={() => openChallenge(hotspot)}
                >
                  <span className="museum-hotspot-icon">{completed ? <Check size={14} /> : <Search size={14} />}</span>
                  <span className="museum-hotspot-tooltip">{completed ? 'Pista descoberta' : 'Investigar'}</span>
                  <span className="sr-only">Objeto investigável {index + 1}</span>
                </button>
              )
            })}
          </div>

          {selectedHotspot && (
            <div className="museum-challenge-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeChallenge() }}>
              <section className="museum-challenge-modal" role="dialog" aria-modal="true" aria-labelledby="museum-challenge-title">
                <button className="museum-challenge-close" type="button" aria-label="Fechar investigação" onClick={closeChallenge}><X size={18} /></button>
                <span className="museum-challenge-eyebrow"><Search size={14} /> INVESTIGAÇÃO</span>
                <h2 id="museum-challenge-title">{selectedHotspot.title}</h2>
                <p className="museum-challenge-context">{selectedHotspot.context}</p>
                <p className="museum-challenge-problem">{selectedHotspot.problem}</p>
                {feedback?.correct ? (
                  <div className="museum-challenge-success">
                    <span><CheckCircle2 size={18} /> {feedback.text}</span>
                    {feedback.clue && <p><KeyRound size={15} /> <b>Pista:</b> {feedback.clue}</p>}
                    <button className="museum-challenge-submit" type="button" onClick={closeChallenge}>Continuar explorando</button>
                  </div>
                ) : (
                  <form className="museum-challenge-form" onSubmit={verifyAnswer}>
                    <label htmlFor="museum-answer">Sua resposta</label>
                    <div className="museum-answer-wrap">
                      <input id="museum-answer" autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={`Resposta em ${selectedHotspot.unit}`} inputMode="decimal" required />
                      <span>{selectedHotspot.unit}</span>
                    </div>
                    {feedback && <p className="museum-challenge-error" role="alert">{feedback.text}</p>}
                    <button className="museum-challenge-submit" type="submit">Verificar resposta</button>
                  </form>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <footer className="museum-room-footer">
        <span>O Roubo no Museu <i /> Pistas: {solved.length}/3</span>
        <div className="museum-room-footer-actions">
          {roomComplete
            ? nextRoom
              ? <Link to={`/museu/${nextRoom}`}>Próxima sala desbloqueada <CheckCircle2 size={14} /></Link>
              : <Link to="/conclusao">Continuar investigação <CheckCircle2 size={14} /></Link>
            : <span className="museum-exit-locked"><LockKeyhole size={13} /> Sala bloqueada</span>}
          <Link to="/museu"><ArrowLeft size={14} /> Voltar à planta</Link>
        </div>
      </footer>
    </>
  )
}
