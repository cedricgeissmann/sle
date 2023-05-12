import { useCallback, useContext } from 'react'
import './Side.css'
import { AppContext } from './App'

function ChapterLink({chapter}) {
  const chapterContext = useContext(AppContext)

  const updateChapter = useCallback((event) => {
    chapterContext.setChapter(chapter)
  })

  return (
    <a href="#" onClick={updateChapter}>Kapitel {chapter}</a>
  )
}

export default ChapterLink
