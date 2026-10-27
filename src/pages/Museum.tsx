import { useEffect, useState } from 'react'
import { Bone, CheckCircle2, Compass, Crown, Landmark, LockKeyhole, Map, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import museumMapImage from '../images/museuVista.png'
import { roomOrder, type RoomId } from '../data/museumGame'
import { getMuseumProgress, isInvestigationComplete, isRoomComplete, isRoomUnlocked, MUSEUM_PROGRESS_EVENT, type MuseumProgress } from '../lib/museumProgress'

type RoomStatus = 'available' | 'locked' | 'complete'

const rooms: { id: RoomId; name: string; icon: typeof Landmark; position: string }[] = [
  { id: 'antiguidades', name: 'Egito Antigo', icon: Landmark, position: 'northwest' },
  { id: 'galeria-real', name: 'Galeria Real', icon: Crown, position: 'northeast' },
  { id: 'expedicao', name: 'Sala Nórdica', icon: Compass, position: 'southwest' },
  { id: 'fosseis', name: 'Pré-História', icon: Bone, position: 'southeast' },
]

function ProgressLegend() {
  return (
    <div className="museum-legend" aria-label="Legenda da planta">
      <span className="legend-complete"><CheckCircle2 aria-hidden="true" /> Concluído</span>
      <span className="legend-available"><Star aria-hidden="true" fill="currentColor" /> Disponível</span>
      <span className="legend-locked"><LockKeyhole aria-hidden="true" fill="currentColor" /> Bloqueado</span>
    </div>
  )
}

export default function Museum() {
  const [progress, setProgress] = useState<MuseumProgress>(getMuseumProgress)

  useEffect(() => {
    const refresh = () => setProgress(getMuseumProgress())
    window.addEventListener(MUSEUM_PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(MUSEUM_PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const completedCount = progress.completedRooms.length
  const allComplete = isInvestigationComplete(progress)

  return (
    <>
      <section className="museum-plan-card">
        <header className="museum-plan-header">
          <h1><Map size={16} strokeWidth={2.5} /> Planta do museu</h1>
          <ProgressLegend />
        </header>
        <div className="museum-map-stage">
          <img
            className="museum-map-image"
            src={museumMapImage}
            alt="Planta isométrica do museu com quatro galerias em torno da rotunda central."
          />
          <nav className="museum-room-markers" aria-label="Salas do museu">
            {rooms.map(({ id, name, icon: Icon, position }) => {
              const complete = isRoomComplete(progress, id)
              const unlocked = isRoomUnlocked(progress, id)
              const status: RoomStatus = complete ? 'complete' : unlocked ? 'available' : 'locked'
              const StatusIcon = complete ? CheckCircle2 : unlocked ? Star : LockKeyhole
              const content = <>
                <StatusIcon className={`room-progress-icon ${status}`} aria-hidden="true" fill={status === 'complete' ? 'none' : 'currentColor'} />
                <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                <span>{name}</span>
                <small>{complete ? '3/3 pistas' : unlocked ? `${progress.rooms[id].completedHotspots.length}/3 pistas` : 'Sala bloqueada'}</small>
              </>

              return unlocked ? (
                <Link key={id} to={`/museu/${id}`} className={`museum-room-marker ${position} ${status}`} aria-label={`${name}, ${status === 'complete' ? 'concluída' : 'disponível'}`}>
                  {content}
                </Link>
              ) : (
                <div key={id} className={`museum-room-marker ${position} ${status}`} aria-disabled="true" aria-label={`${name}, bloqueada`}>
                  {content}
                </div>
              )
            })}
          </nav>
        </div>
      </section>
      <div className="museum-overall-progress" aria-label="Progresso da investigação">
        <span>Salas concluídas: {completedCount}/{roomOrder.length}</span>
        <span className="museum-overall-track"><i style={{ width: `${(completedCount / roomOrder.length) * 100}%` }} /></span>
        {allComplete && (
          <Link className="museum-final-link" to="/conclusao">
            {progress.finalCompleted ? 'Rever dedução final' : 'Investigar o caso'} <CheckCircle2 size={15} />
          </Link>
        )}
      </div>
    </>
  )
}
