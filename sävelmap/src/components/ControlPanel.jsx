import React from 'react'

// Very small control panel: root and scale selectors.
// Props:
// - notes: array of {id, name, display_name}
// - scales: array of {id, display_name}
// - rootId, scaleId: current selections
// - onRootChange(id), onScaleChange(id)
import './ControlPanel.css'

export default function ControlPanel({ notes = [], scales = [], rootId, scaleId, onRootChange, onScaleChange }) {
  return (
    <div className="control-panel">
      <label className="control-panel__label">
        Root:&nbsp;
        <select value={rootId} onChange={e => onRootChange(Number(e.target.value))}>
          {notes.map(n => (
            <option key={n.id} value={n.id}>{n.display_name || n.name}</option>
          ))}
        </select>
      </label>

      <label className="control-panel__label">
        Scale:&nbsp;
        <select value={scaleId} onChange={e => onScaleChange(e.target.value)}>
          {scales.map(s => (
            <option key={s.id} value={s.id}>{s.display_name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
