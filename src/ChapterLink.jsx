import { useCallback, useContext } from 'react'
import './Side.css'
import { AppContext } from './App'

function ChapterLink({chapter, name}) {
  const {setChapter} = useContext(AppContext)

  const updateChapter = useCallback((event) => {
    setChapter(chapter)
  })

  return (
    <a href="#" onClick={updateChapter}>
      {name ? name : `Kapitel ${chapter}`}
    </a>
  )
}

export default ChapterLink
