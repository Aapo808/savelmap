import { useState } from 'react'

function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return

    // Placeholder submit: in real app, post to newsletter service.
    setStatus('Kiitos tilauksesta! Vahvista sähköpostistasi, kun saat viestin.')
    setEmail('')
  }

  return (
    <footer className="footer">
      

      <div className="footer__body">
        <div className="newsletter">
          <div className="newsletter__text">
            <p className="eyebrow">Uutiskirje</p>
            <h2>Tilaa meidän uutiskirje!</h2>
            <p>
            Vinkkejä, päivityksiä ja uusia asteikkoja suoraan sähköpostiisi.
            </p>
          </div>
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">
              Sähköpostiosoite
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="sahkoposti@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus('')
              }}
              required
            />
            <button type="submit">Tilaa</button>
          </form>
        </div>
        {status && (
          <p className="newsletter__status" role="status" aria-live="polite">
            {status}
          </p>
        )}

        <div className="footer__grid">
          <div className="footer__brand">
            <div className="brand__logo">Sävelmap</div>
            <p>
              Keltanokkien lempi musiikkityökalu!
            </p>
            <div className="footer__contact">
              <span>support@savelmap.app</span>
              <span>Helsinki, Finland</span>
            </div>
          </div>

          <div className="footer__col">
            <h2>Tekijät</h2>
            <a href="https://github.com/Aapo808">Aapo Mustonen</a>
            <a href="https://github.com/zirbyy">Veertti Peuranen</a>
          </div>
          </div>

        <div className="footer__meta">
          <span>© 2025 Sävelmap. All rights reserved.</span>  
        </div>
      </div>
    </footer>
  )
}

export default Footer

