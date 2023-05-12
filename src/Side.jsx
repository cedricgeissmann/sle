import ChapterLink from './ChapterLink'
import './Side.css'

function Side({onChapterChange}) {

  return (
    <ul>
      <li><ChapterLink chapter={1} onChapterChange={onChapterChange} /></li>
      <li><ChapterLink chapter={2} onChapterChange={onChapterChange} /></li>
    </ul>
  )
}

export default Side
