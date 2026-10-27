import { museumRooms, roomOrder, type RoomId } from '../data/museumGame'

const STORAGE_KEY = 'museum-game-progress-v1'
export const MUSEUM_PROGRESS_EVENT = 'museum-game-progress-updated'

export type RoomProgress = {
  completedHotspots: string[]
  answers: Record<string, string>
  clues: Record<string, string>
}

export type MuseumProgress = {
  rooms: Record<RoomId, RoomProgress>
  completedRooms: RoomId[]
  finalCompleted: boolean
}

function emptyRoomProgress(): RoomProgress {
  return { completedHotspots: [], answers: {}, clues: {} }
}

function emptyProgress(): MuseumProgress {
  return {
    rooms: {
      antiguidades: emptyRoomProgress(),
      expedicao: emptyRoomProgress(),
      'galeria-real': emptyRoomProgress(),
      fosseis: emptyRoomProgress(),
    },
    completedRooms: [],
    finalCompleted: false,
  }
}

export function getMuseumProgress(): MuseumProgress {
  if (typeof window === 'undefined') return emptyProgress()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const saved = JSON.parse(raw) as Partial<MuseumProgress>
    const clean = emptyProgress()

    for (const roomId of roomOrder) {
      const savedRoom = saved.rooms?.[roomId]
      if (!savedRoom) continue
      const validIds = new Set(museumRooms[roomId].hotspots.map((hotspot) => hotspot.id))
      clean.rooms[roomId] = {
        completedHotspots: Array.isArray(savedRoom.completedHotspots)
          ? savedRoom.completedHotspots.filter((id) => validIds.has(id))
          : [],
        answers: Object.fromEntries(Object.entries(savedRoom.answers ?? {}).filter(([id]) => validIds.has(id))),
        clues: Object.fromEntries(Object.entries(savedRoom.clues ?? {}).filter(([id]) => validIds.has(id))),
      }
    }
    clean.completedRooms = roomOrder.filter((id) => clean.rooms[id].completedHotspots.length === 3)
    clean.finalCompleted = Boolean(saved.finalCompleted && clean.completedRooms.length === roomOrder.length)
    return clean
  } catch {
    return emptyProgress()
  }
}

function persist(progress: MuseumProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Keep the in-memory investigation usable if browser storage is unavailable.
  }
  window.dispatchEvent(new Event(MUSEUM_PROGRESS_EVENT))
}

export function completeHotspot(roomId: RoomId, hotspotId: string, answer: string): MuseumProgress {
  const room = museumRooms[roomId]
  const hotspot = room.hotspots.find((item) => item.id === hotspotId)
  const current = getMuseumProgress()
  if (!hotspot || current.rooms[roomId].completedHotspots.includes(hotspotId)) return current

  const completedHotspots = [...current.rooms[roomId].completedHotspots, hotspotId]
  const updated: MuseumProgress = {
    ...current,
    rooms: {
      ...current.rooms,
      [roomId]: {
        completedHotspots,
        answers: { ...current.rooms[roomId].answers, [hotspotId]: answer },
        clues: { ...current.rooms[roomId].clues, [hotspotId]: hotspot.clue },
      },
    },
    completedRooms: roomOrder.filter((id) => id === roomId
      ? completedHotspots.length === room.hotspots.length
      : current.completedRooms.includes(id)),
  }
  persist(updated)
  return updated
}

export function completeFinalInvestigation(): MuseumProgress {
  const current = getMuseumProgress()
  if (current.completedRooms.length !== roomOrder.length) return current
  const updated = { ...current, finalCompleted: true }
  persist(updated)
  return updated
}

export function isRoomComplete(progress: MuseumProgress, roomId: RoomId): boolean {
  return progress.completedRooms.includes(roomId)
}

export function isRoomUnlocked(progress: MuseumProgress, roomId: RoomId): boolean {
  if (isRoomComplete(progress, roomId)) return true
  const index = roomOrder.indexOf(roomId)
  return index === 0 || progress.completedRooms.includes(roomOrder[index - 1])
}

export function isInvestigationComplete(progress: MuseumProgress): boolean {
  return progress.completedRooms.length === roomOrder.length
}
