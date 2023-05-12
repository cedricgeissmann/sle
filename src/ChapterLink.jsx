import { useCallback } from 'react'
import './Side.css'

function ChapterLink({chapter, onChapterChange}) {

  const updateChapter = useCallback((event) => {
    console.log(chapter)
    onChapterChange(chapter)
  })

  return (
    <a href="#" onClick={updateChapter}>Kapitel {chapter}</a>
  )
}

export default ChapterLink
