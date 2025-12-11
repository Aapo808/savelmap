import React from 'react'
import { useAudio } from './audioContext'
import * as Tone from 'tone'

// Simple Fretboard component. Keeps rendering logic readable and isolated.
// Props:
// - notes: array of note objects from API
// - scaleNoteSet: Set of note ids to show
// - rootId: current root id (0..11)
// - stringOpenNotes: array length 6 with open note ids
// - numFrets, fretWidth, stringHeight, paddingTop, paddingLeft
// - isRoot(noteId): helper to test root
export default function Fretboard({
  notes = [],
  scaleNoteSet = new Set(),
  stringOpenNotes = [4, 11, 7, 2, 9, 4],
  numFrets = 13,
  fretWidth = 100,
  stringHeight = 55,
  paddingTop = 10,
  paddingLeft = 0,
  isRoot = () => false,
}) {
  const { play } = useAudio()
  const [mouseDown, setMouseDown] = React.useState(false)
//Käsittely hiiren painallukselle ja vetämiselle 
  const handleMouseDown = () => setMouseDown(true)
  const handleMouseUp = () => setMouseDown(false)
  const handleMouseEnter = (noteStr) => {
    if (mouseDown) play(noteStr)
  }
  const height = paddingTop + stringHeight * 6 + 10
  const width = paddingLeft + fretWidth * numFrets + 10

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMin meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {Array.from({ length: 6 }).map((_, stringIdx) => {
        const y = paddingTop + stringIdx * stringHeight
        return (
          <g key={`string-${stringIdx}`}>
            {stringIdx === 5 ? null : Array.from({ length: numFrets }).map((_, fretIdx) => {
              // Skip drawing the first column (fret 0) but still reserve space for notes
              if (fretIdx === 0) return null
              return (
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
              )
            })}
          </g>
        )
      })}

      {/* Nut */}
      <line x1={paddingLeft + fretWidth} y1={paddingTop - 10} x2={paddingLeft + fretWidth} y2={paddingTop + stringHeight * 5 + 10} stroke="black" strokeWidth="6" />

      {/* Fretboard markers (3,5,7,9,12) */}
      {[3, 5, 7, 9, ].map(f => (
        <circle key={`marker-${f}`} cx={paddingLeft + (f + 0.5) * fretWidth} cy={paddingTop + stringHeight * 2 + stringHeight / 2} r="10" fill="black" />
      ))}
       {[12].map(f => (
        <circle key={`marker-${f}`} cx={paddingLeft + (f + 0.5) * fretWidth} cy={paddingTop + stringHeight * 1 + stringHeight / 2} r="10" fill="black" />
      ))}
       {[12].map(f => (
        <circle key={`marker-${f}`} cx={paddingLeft + (f + 0.5) * fretWidth} cy={paddingTop + stringHeight * 3 + stringHeight / 2} r="10" fill="black" />
      ))}

      {/* Scale notes */}
      {Array.from({ length: 6 }).map((_, stringIdx) => {
        const openNote = stringOpenNotes[stringIdx]
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
              const noteObj = notes.find(n => n.id === noteId)
              const noteName = noteObj?.display_name || noteObj?.name || `Note ${noteId}`
              const textColor = root ? '#000' : '#fff'
              // compute note pitch with octave based on string
              const stringOctaves = [4, 3, 3, 3, 2, 2]
              const baseOctave = stringOctaves[stringIdx] || 3
              // MIDI number for the note: (octave+1)*12 + semitone
              const midi = (baseOctave + 1) * 12 + openNote + fretIdx
              const noteStr = Tone.Frequency(midi, 'midi').toNote()

              return (
                <g key={`n-${stringIdx}-${fretIdx}`} onMouseDown={() => play(noteStr)} onMouseEnter={() => handleMouseEnter(noteStr)} style={{ cursor: 'pointer' }}>
                  <circle cx={cx} cy={cy} r={10} fill={root ? '#f4b400' : '#6e84ffff'} stroke={root ? '#000' : 'none'} />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={textColor} className="fretboard-note-text" style={{ pointerEvents: 'none', fontFamily: 'sans-serif' }}>
                    {noteName}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}
