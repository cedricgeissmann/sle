import ChapterLink from './ChapterLink'
import './Side.css'

function Side() {


  return (
    <ul>
      <li><ChapterLink chapter={1} name="Caesar-Verfahren"/></li>
      <li><ChapterLink chapter={2} name="Quiz: Caesar-Verfahren"/></li>
      <li><ChapterLink chapter={3} name="Vigenère" /></li>
    </ul>
  )
}

export default Side
