import ChapterLink from './ChapterLink'
import QuizLink from './QuizLink'
import './Side.css'

function Side() {


  return (
    <ul>
      <li><ChapterLink chapter={1} name="Verschlüsselungsverfahren"/></li>
      <li><QuizLink chapter={2} name="Quiz: Verschlüsselungsverfahren" quizType="encryption"/></li>
      <li><ChapterLink chapter={3} name="Caesar-Verfahren"/></li>
      <li><QuizLink chapter={4} name="Quiz: Caesar-Verfahren" quizType="caesar"/></li>
      <li><ChapterLink chapter={5} name="Vigenère" /></li>
    </ul>
  )
}

export default Side
