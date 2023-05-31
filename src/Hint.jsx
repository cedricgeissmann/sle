import { useState, useEffect } from 'react'

function Hint({hintFile}) {
  const [hint, setHint] = useState([])
  const [randomHint, setRandomHint] = useState(0)

  useEffect(() => {
    fetch(`src/assets/hints/${hintFile}`).then(res => res.json()).then(data => {
      setHint(data)
    })
  }, [])

  function newHint() {
    setRandomHint(Math.floor(Math.random() * hint.length))
  }

  return (
    <div className="hint" onMouseEnter={newHint}>
      <p>Tipp</p>
      <p>{hint[randomHint]}</p>
    </div>
  )
}

export default Hint
