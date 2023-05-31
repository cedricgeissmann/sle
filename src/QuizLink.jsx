import { useCallback, useContext } from 'react'
import './Side.css'
import { AppContext } from './App'
import useStorage from './useStorage'

function QuizLink({chapter, name, quizType}) {
  const {setChapter} = useContext(AppContext)
  const [points, setPoints] = useStorage(`quiz-${quizType}-percent`, 0)

  const updateChapter = useCallback((event) => {
    setChapter(chapter)
  })

  return (
    <a className="quiz-link" href="#" onClick={updateChapter}>
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
