import { useCallback, useContext } from 'react'
import './Side.css'
import { AppContext } from './App'

function ChapterLink({chapter, name}) {
  const ctx = useContext(AppContext)

  const updateChapter = useCallback((event) => {
    ctx.setChapter(chapter)
  })

  return (
    <a href="#"
      className={chapter === ctx.chapter ? 'active' : ''}
      onClick={updateChapter}>
      {name ? name : `Kapitel ${chapter}`}
    </a>
  )
}

export default ChapterLink
