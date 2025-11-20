import { useEffect, useMemo, useState } from 'react'

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  natural_minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  blues_minor: [0, 3, 5, 6, 7, 10],
}

const STRING_OPEN_NOTES = [4, 9, 2, 7, 11, 4] // E A D G B E (0..11)

const ensureDisplayName = note => {
  if (note.display_name) return note
  if (!note.flat_name) {
    return {
      ...note,
      display_name: note.name,
    }
  }
  return {
    ...note,
    display_name: `${note.name}/${note.flat_name}`,
  }
}

function App() {
  const [notes, setNotes] = useState([])
  const [scales, setScales] = useState([])
  const [rootId, setRootId] = useState(0)
  const [scaleId, setScaleId] = useState('major')

  useEffect(() => {
    Promise.all([
      fetch('/api/notes').then(r => r.json()),
      fetch('/api/scales').then(r => r.json()),
    ]).then(([notesRes, scalesRes]) => {
      setNotes(notesRes.map(ensureDisplayName))
      setScales(scalesRes)
    }).catch(() => {
      // In case API not available, fall back to defaults
      setNotes([
        { id: 0, name: 'C', flat_name: null, display_name: 'C' },
        { id: 1, name: 'C#', flat_name: 'Db', display_name: 'C#/Db' },
        { id: 2, name: 'D', flat_name: null, display_name: 'D' },
        { id: 3, name: 'D#', flat_name: 'Eb', display_name: 'D#/Eb' },
        { id: 4, name: 'E', flat_name: null, display_name: 'E' },
        { id: 5, name: 'F', flat_name: null, display_name: 'F' },
        { id: 6, name: 'F#', flat_name: 'Gb', display_name: 'F#/Gb' },
        { id: 7, name: 'G', flat_name: null, display_name: 'G' },
        { id: 8, name: 'G#', flat_name: 'Ab', display_name: 'G#/Ab' },
        { id: 9, name: 'A', flat_name: null, display_name: 'A' },
        { id: 10, name: 'A#', flat_name: 'Bb', display_name: 'A#/Bb' },
        { id: 11, name: 'B', flat_name: null, display_name: 'B' },
      ])
      setScales([
        { id: 'major', display_name: 'Major (Ionian)' },
        { id: 'natural_minor', display_name: 'Natural Minor (Aeolian)' },
        { id: 'dorian', display_name: 'Dorian' },
        { id: 'mixolydian', display_name: 'Mixolydian' },
        { id: 'major_pentatonic', display_name: 'Major Pentatonic' },
        { id: 'minor_pentatonic', display_name: 'Minor Pentatonic' },
        { id: 'blues_minor', display_name: 'Blues (Minor)' },
      ])
    })
  }, [])

  const numFrets = 13 // 0..12 inclusive
  const fretWidth = 100
  const stringHeight = 60
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

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <label>
          Root:&nbsp;
          <select value={rootId} onChange={e => setRootId(Number(e.target.value))}>
            {notes.map(n => (
              <option key={n.id} value={n.id}>{n.display_name ?? n.name}</option>
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

      <svg height={paddingTop + stringHeight * 6 + 10} width={paddingLeft + fretWidth * numFrets + 200} xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 6 }).map((_, stringIdx) => {
          const y = paddingTop + stringIdx * stringHeight
          return (
            <g key={`string-${stringIdx}`}>
              <line x1={paddingLeft} y1={y} x2={paddingLeft + fretWidth * numFrets + 100} y2={y} stroke="black" strokeWidth="3" />
              {Array.from({ length: numFrets }).map((_, fretIdx) => (
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
        <line x1={paddingLeft + fretWidth} y1={paddingTop - 10} x2={paddingLeft + fretWidth} y2={paddingTop + stringHeight * 6 + 10} stroke="black" strokeWidth="6" />

        {/* Fretboard markers (3,5,7,9,12) */}
        {[3, 5, 7, 9, 12].map(f => (
          <circle key={`marker-${f}`} cx={paddingLeft + (f + 0.5) * fretWidth} cy={paddingTop + stringHeight * 2 + stringHeight / 2} r="10" fill="black" />
        ))}

        {/* Scale notes */}
        {Array.from({ length: 6 }).map((_, stringIdx) => {
          const openNote = STRING_OPEN_NOTES[stringIdx]
          const yCenter = paddingTop + stringIdx * stringHeight + stringHeight / 2
          return (
            <g key={`notes-${stringIdx}`}>
              {Array.from({ length: numFrets }).map((_, fretIdx) => {
                const noteId = (openNote + fretIdx) % 12
                const show = scaleNoteSet.has(noteId)
                if (!show) return null
                const cx = paddingLeft + fretIdx * fretWidth + fretWidth / 2
                const cy = yCenter
                const root = isRoot(noteId)
                return (
                  <circle key={`n-${stringIdx}-${fretIdx}`} cx={cx} cy={cy} r="12" fill={root ? '#f4b400' : '#111'} stroke={root ? '#000' : 'none'} />
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