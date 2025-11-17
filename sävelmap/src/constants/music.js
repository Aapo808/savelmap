// Simple, easy-to-read music constants and helpers.
// NOTE: numbers 0..11 represent chromatic scale semitones where 0 = C, 1 = C#/Db, ... 11 = B

export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

// Common flat names for the enharmonic (same-pitch) notes.
// We only need flats for the five sharps that often flip to flats: C#, D#, F#, G#, A#
const ENHARMONIC_FLAT = {
  1: 'Db', // C# -> Db
  3: 'Eb', // D# -> Eb
  6: 'Gb', // F# -> Gb
  8: 'Ab', // G# -> Ab
  10: 'Bb', // A# -> Bb
  // (11 -> Cb and 0 -> B# are possible but not used in this simple helper)
}

// For each major key (root id), list which chromatic ids are better shown as flats.
// Example: in the key of F (rootId = 5) we prefer A# to be shown as 'Bb' (id 10).
// We keep this minimal and readable.
const KEY_FLAT_PREFERENCES = {
  // rootId: [list of note ids to show as flats]
  // These map major keys that traditionally use flats to the chromatic ids
  // that should be displayed as flats in that key.
  5: [10],                       // F -> Bb
  10: [10, 3],                   // Bb -> Bb, Eb
  3: [10, 3, 8],                 // Eb -> Bb, Eb, Ab
  8: [10, 3, 8, 1],              // Ab -> Bb, Eb, Ab, Db
  1: [10, 3, 8, 1, 6],           // Db -> Bb, Eb, Ab, Db, Gb
  6: [10, 3, 8, 1, 6, 11],       // Gb -> Bb, Eb, Ab, Db, Gb, Cb
  11: [10, 3, 8, 1, 6, 11, 4],   // Cb (aka B) -> Bb, Eb, Ab, Db, Gb, Cb, Fb
}

// Public simple defaults for UI
export const DEFAULT_NOTES = NOTE_NAMES.map((name, id) => ({ id, name }))
export const DEFAULT_SCALES = [
  { id: 'major', display_name: 'Major (Ionian)' },
  { id: 'natural_minor', display_name: 'Natural Minor (Aeolian)' },
  { id: 'dorian', display_name: 'Dorian' },
  { id: 'mixolydian', display_name: 'Mixolydian' },
  { id: 'major_pentatonic', display_name: 'Major Pentatonic' },
  { id: 'minor_pentatonic', display_name: 'Minor Pentatonic' },
  { id: 'blues_minor', display_name: 'Blues (Minor)' },
]

export const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  natural_minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
  minor_pentatonic: [0, 3, 5, 7, 10],
  blues_minor: [0, 3, 5, 6, 7, 10],
}

// Standard guitar tuning (from highest string to lowest): high E, B, G, D, A, low E
export const STRING_OPEN_NOTES = [4, 11, 7, 2, 9, 4]

// Helper: return preferred display name for a chromatic id (0..11)
// If the current key (rootId) prefers flats for this id, return flat name; otherwise return sharp name.
export function preferredNoteName(noteId, rootId = 0) {
  const flatList = KEY_FLAT_PREFERENCES[rootId]
  if (flatList && flatList.includes(noteId) && ENHARMONIC_FLAT[noteId]) {
    return ENHARMONIC_FLAT[noteId]
  }
  return NOTE_NAMES[noteId]
}

// Helper: return names for all 12 chromatic steps according to a key
export function chromaticNamesForKey(rootId = 0) {
  return Array.from({ length: 12 }).map((_, id) => preferredNoteName(id, rootId))
}

// Helper: return note names for a given scale (rootId + scale id)
export function scaleNoteNames(rootId = 0, scaleId = 'major') {
  const intervals = SCALE_INTERVALS[scaleId] || []
  return intervals.map(semi => preferredNoteName((rootId + semi) % 12, rootId))
}

// Return all configured scales (from SCALE_INTERVALS) for a given root as named notes
export function rootScales(rootId = 0) {
  const result = {}
  for (const scaleId of Object.keys(SCALE_INTERVALS)) {
    result[scaleId] = scaleNoteNames(rootId, scaleId)
  }
  return result
}

// Return all scales for every root (0..11). Useful for UI that lists "root -> scale notes".
export function allRootScales() {
  const out = {}
  for (let root = 0; root < 12; root++) {
    out[root] = rootScales(root)
  }
  return out
}

