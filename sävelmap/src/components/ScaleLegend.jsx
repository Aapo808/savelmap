import React from 'react'
// Simple legend showing the selected scale notes (names in order)
// Props: notes (array), currentScale (object with intervals), rootId
export default function ScaleLegend({ notes = [], currentScale = null, rootId = 0 }) {
  if (!currentScale) return null
  const noteNames = currentScale.intervals.map(semi => {
    const id = (rootId + semi) % 12
    const note = notes.find(n => n.id === id)
    return note?.display_name || note?.name || `N${id}`
  })
  return (
    <div style={{ marginTop: 12 }}>
      <strong>{currentScale.display_name}:</strong>&nbsp;{noteNames.join(', ')}
    </div>
  )
}