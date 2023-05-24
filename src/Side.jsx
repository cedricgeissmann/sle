import { AppContext } from './App'
import ChapterLink from './ChapterLink'
import './Side.css'

function Side() {


  return (
    <ul>
      <li><ChapterLink chapter={1} /></li>
      <li><ChapterLink chapter={2} /></li>
      <li><ChapterLink chapter={3} /></li>
    </ul>
  )
}

export default Side
