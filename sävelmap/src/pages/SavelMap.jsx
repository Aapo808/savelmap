import { useEffect, useMemo, useState } from 'react'
import ControlPanel from '../components/ControlPanel.jsx'
import Fretboard from '../components/Fretboard.jsx'
import AudioProvider from '../components/AudioGuitar.jsx'

import '../App.css'

function SavelMap() {
  const [notes, setNotes] = useState([])
  const [scales, setScales] = useState([])
  const [rootId, setRootId] = useState(0)
  const [scaleId, setScaleId] = useState('major')
  const [scaleNotesMap, setScaleNotesMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true) 
    Promise.all([
      fetch('/api/notes').then(r => r.json()),
      fetch('/api/scales').then(r => r.json()),
    ]).then(([notesRes, scalesRes]) => {
      setNotes(notesRes || [])
      setScales(scalesRes || [])
      setLoading(false)
    }).catch(err => {
      console.error('Failed to fetch API data:', err)
      setLoading(false)
    })
  }, [])

  // Fetch scale note names (note_ids and note_names) for the selected root
  useEffect(() => {
    // Clear previous data for a better UX while loading
    setScaleNotesMap({})
    fetch(`/api/scale-notes?root=${rootId}`)
      .then(r => {
        console.log('scale-notes response status:', r.status)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(res => {
        console.log('scale-notes data:', res)
        console.log('res is array?', Array.isArray(res))
        // res is expected to be an array of scales with { id, note_ids, note_names, intervals }
        const map = {}
        if (Array.isArray(res)) {
          res.forEach(s => {
            map[s.id] = s
          })
        }
        console.log('scaleNotesMap updated:', map)
        setScaleNotesMap(map)
      })
      .catch((err) => {
        console.error('API /api/scale-notes error:', err)
      })
  }, [rootId])

  const numFrets = 13 // 0..12 inclusive
  const fretWidth = 100
  const stringHeight = 55
  const paddingTop = 10
  const paddingLeft = 0

  const scaleNoteSet = useMemo(() => {
    // Prefer server-provided note_ids for the current root+scale if available
    const scaleData = scaleNotesMap[scaleId]
    if (scaleData && Array.isArray(scaleData.note_ids)) {
      return new Set(scaleData.note_ids.map(n => n % 12))
    }
    // No server data yet — show nothing until API responds
    return new Set()
  }, [rootId, scaleId, scaleNotesMap])

  const isRoot = (noteId) => noteId % 12 === rootId

  return (
    <AudioProvider>
      <>
        <h1>Sävelmap</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div id="moi">
              <ControlPanel 
                notes={notes} 
                scales={scales} 
                rootId={rootId} 
                scaleId={scaleId} 
                onRootChange={setRootId} 
                onScaleChange={setScaleId} 
              />
            </div>
            <Fretboard 
              notes={notes}
              scaleNoteSet={scaleNoteSet}
              rootId={rootId}
              stringOpenNotes={[4, 11, 7, 2, 9, 4]}
              numFrets={numFrets}
              fretWidth={fretWidth}
              stringHeight={stringHeight}
              paddingTop={paddingTop}
              paddingLeft={paddingLeft}
              isRoot={isRoot}
            />
          </>
        )}
      </>
    </AudioProvider>
  )
}

export default SavelMap
