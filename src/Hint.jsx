import { useState, useEffect } from 'react'
import {HINTS} from './hints.js'

function Hint({hintFile = '', hintText = '', title = 'Tipp'}) {
  const [hint, setHint] = useState([])
  const [randomHint, setRandomHint] = useState(0)

  useEffect(() => {
    if (hintFile) {
      setHint(HINTS[hintFile])
    } else {
      setHint([hintText])
    }
  }, [])

  function newHint() {
    setRandomHint(Math.floor(Math.random() * hint.length))
  }

  return (
    <div className="hint" onMouseEnter={newHint}>
      <p>{title}</p>
      <p>{hint[randomHint]}</p>
    </div>
  )
}

export default Hint
