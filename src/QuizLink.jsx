import { useCallback, useContext, useEffect, useState } from 'react'
import './Side.css'
import { AppContext } from './App'
import useStorage from './useStorage'
import { getSessionStorageOrDefault } from './utils'

function QuizLink({chapter, name, quizType}) {
  const ctx = useContext(AppContext)
  const [points, setPoints] = useState(0)

  const updateChapter = useCallback((event) => {
    ctx.setChapter(chapter)
  })

  useEffect(() => {
    const timeout = setInterval(() => {
      setPoints(getSessionStorageOrDefault(`quiz-${quizType}-percent`, 0))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <a 
      className={`quiz-link ${chapter === ctx.chapter ? 'active' : ''}`}
      href="#"
      onClick={updateChapter}>
      <span>
        {name ? name : `Kapitel ${chapter}`}
      </span>
      <span>
        {points}%
      </span>
    </a>
  )
}

export default QuizLink
