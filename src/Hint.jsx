import { useState, useEffect } from 'react'

function Hint({hintFile = '', hintText = '', title = 'Tipp'}) {
  const [hint, setHint] = useState([])
  const [randomHint, setRandomHint] = useState(0)

  useEffect(() => {
    if (hintFile) {
    fetch(`src/assets/hints/${hintFile}`).then(res => res.json()).then(data => {
      setHint(data)
    })
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
