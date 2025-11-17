import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { preferredNoteName } from './constants/music'

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  natural_minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  blues_minor: [0, 3, 5, 6, 7, 10],
}

// Strings from top to bottom: high E, B, G, D, A, low E
const STRING_OPEN_NOTES = [4, 11, 7, 2, 9, 4]

// Fallback note names if `/api/notes` doesn't provide them yet
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Default data shown before API responds or when API is unavailable
const DEFAULT_NOTES = NOTE_NAMES.map((name, i) => ({ id: i, name }))
const DEFAULT_SCALES = [
  { id: 'major', display_name: 'Major (Ionian)' },
  { id: 'natural_minor', display_name: 'Natural Minor (Aeolian)' },
  { id: 'dorian', display_name: 'Dorian' },
  { id: 'mixolydian', display_name: 'Mixolydian' },
  { id: 'major_pentatonic', display_name: 'Major Pentatonic' },
  { id: 'minor_pentatonic', display_name: 'Minor Pentatonic' },
  { id: 'blues_minor', display_name: 'Blues (Minor)' },
]
function App() {
  const [notes, setNotes] = useState(DEFAULT_NOTES)
  const [scales, setScales] = useState(DEFAULT_SCALES)
  const [rootId, setRootId] = useState(0)
  const [scaleId, setScaleId] = useState('major')

  useEffect(() => {
    Promise.all([
      fetch('/api/notes').then(r => r.json()),
      fetch('/api/scales').then(r => r.json()),
    ]).then(([notesRes, scalesRes]) => {
      setNotes(notesRes)
      setScales(scalesRes)
    }).catch(() => {
      // If API is unavailable, keep defaults and continue — selects remain usable
      console.warn('API /api/notes or /api/scales unavailable, using defaults')
    })
  }, [])

  const numFrets = 13 // 0..12 inclusive
  const fretWidth = 100
  const stringHeight = 55
  const paddingTop = 10
  const paddingLeft = 0

  const scaleNoteSet = useMemo(() => {
    const intervals = SCALE_INTERVALS[scaleId] || []
    const set = new Set(intervals.map(semi => (rootId + semi) % 12))
    return set
  }, [rootId, scaleId])

  const isRoot = (noteId) => noteId % 12 === rootId

  return (
    <>
      <h1>Sävelmap</h1>

      <div id='moi' style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <label>
          Root:&nbsp;
          <select value={rootId} onChange={e => setRootId(Number(e.target.value))}>
            {notes.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </label>

        <label>
          Scale:&nbsp;
          <select value={scaleId} onChange={e => setScaleId(e.target.value)}>
            {scales.map(s => (
              <option key={s.id} value={s.id}>{s.display_name}</option>
            ))}
          </select>
        </label>
      </div>

      <svg height={paddingTop + stringHeight * 6 + 10} width={paddingLeft + fretWidth * numFrets + 10} xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 6 }).map((_, stringIdx) => {
          const y = paddingTop + stringIdx * stringHeight
          return (
            <g key={`string-${stringIdx}`}>
              {stringIdx === 5 ? null : Array.from({ length: numFrets }).map((_, fretIdx) => (
                <rect
                  key={`cell-${stringIdx}-${fretIdx}`}
                  width={fretWidth}
                  height={stringHeight}
                  x={paddingLeft + fretIdx * fretWidth}
                  y={y}
                  fill="rgb(255,255,255)"
                  strokeWidth="3"
                  stroke="black"
                />
              ))}
            </g>
          )
        })}

        {/* Nut */}
        <line x1={paddingLeft + fretWidth} y1={paddingTop - 10} x2={paddingLeft + fretWidth} y2={paddingTop + stringHeight * 5 + 10} stroke="black" strokeWidth="6" />

        {/* Fretboard markers (3,5,7,9,12) */}
        {[3, 5, 7, 9, 12].map(f => (
          <circle key={`marker-${f}`} cx={paddingLeft + (f + 0.5) * fretWidth} cy={paddingTop + stringHeight * 2 + stringHeight / 2} r="10" fill="black" />
        ))}

        {/* Scale notes */}
        {Array.from({ length: 6 }).map((_, stringIdx) => {
          const openNote = STRING_OPEN_NOTES[stringIdx]
          const yOnString = paddingTop + stringIdx * stringHeight // draw on top of the string line
          return (
            <g key={`notes-${stringIdx}`}>
              {Array.from({ length: numFrets }).map((_, fretIdx) => {
                const noteId = (openNote + fretIdx) % 12
                const show = scaleNoteSet.has(noteId)
                if (!show) return null
                const cx = paddingLeft + fretIdx * fretWidth + fretWidth / 2
                const cy = yOnString
                const root = isRoot(noteId)
                // Use a preferred display name for this key: prefers flats/sharps depending on root
                // This ensures keys like F will show 'Bb' (id 10) instead of 'A#'.
                const noteName = preferredNoteName(noteId, rootId)
                const textColor = root ? '#000' : '#fff'
                return (
                  <g key={`n-${stringIdx}-${fretIdx}`}>
                    <circle cx={cx} cy={cy} r="10" fill={root ? '#f4b400' : '#6e84ffff'} stroke={root ? '#000' : 'none'} />
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={textColor} style={{ pointerEvents: 'none', fontSize: 10, fontFamily: 'sans-serif' }}>
                      {noteName}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    </>
  )
}

export default App