import React, { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { AudioContext } from './audioContext'

// AudioProvider exposes a simple `play(note, duration)` API.
// This implementation creates an "electric guitar" tone by using
// a poly synth routed through distortion, filter and reverb.
export function AudioProvider({ children }) {
	const synthRef = useRef(null)

	useEffect(() => {
		// Create effects chain: distortion -> filter (cabinet) -> reverb -> destination
		const dist = new Tone.Distortion(0.6)
		const filter = new Tone.Filter(1200, 'lowpass')
		const reverb = new Tone.Reverb({ decay: 2.4, wet: 0.25 })
		const delay = new Tone.FeedbackDelay('8n', 0.15)

		// Create a warm synth voice for electric guitar
		const poly = new Tone.PolySynth(Tone.Synth, {
			oscillator: { type: 'sawtooth' },
			envelope: { attack: 0.002, decay: 0.2, sustain: 0.2, release: 0.8 }
		})

		// Connect nodes: synth -> distortion -> filter -> reverb -> delay -> destination
		poly.connect(dist)
		dist.connect(filter)
		filter.connect(reverb)
		reverb.connect(delay)
		delay.toDestination()

		// Set sensible volume
		poly.volume.value = -8

		synthRef.current = { instrument: poly, effects: { dist, filter, reverb, delay } }

		// Ensure AudioContext is started on first user interaction
		const startOnce = async () => {
			try {
				if (Tone.context.state !== 'running') await Tone.start()
			} catch (e) {
				console.warn('Tone.start failed:', e)
			} finally {
				window.removeEventListener('pointerdown', startOnce)
			}
		}
		window.addEventListener('pointerdown', startOnce)

		// Warm up reverb (async) so first note isn't dry
		reverb.generate()

		return () => {
			const current = synthRef.current
			try { current?.instrument?.dispose() } catch (e) { console.warn('dispose instrument failed', e) }
			try { dist.dispose(); filter.dispose(); reverb.dispose(); delay.dispose() } catch (e) { console.warn('dispose effects failed', e) }
			synthRef.current = null
			window.removeEventListener('pointerdown', startOnce)
		}
	}, [])

	const play = async (note, duration = '8n') => {
		const s = synthRef.current?.instrument
		if (!s) return
		if (Tone.context.state !== 'running') {
			try { await Tone.start() } catch (e) { console.warn('Tone.start failed:', e) }
		}
		s.triggerAttackRelease(note, duration)
	}

	return <AudioContext.Provider value={{ play }}>{children}</AudioContext.Provider>
}

export default AudioProvider

