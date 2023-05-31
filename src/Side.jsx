import ChapterLink from './ChapterLink'
import QuizLink from './QuizLink'
import './Side.css'
import {useContext} from 'react'
import {AppContext} from './App'
import { useEffect, useState } from 'react'

function Side() {

  const {setMaxChapter} = useContext(AppContext)
  useEffect(() => {
    setMaxChapter(6)
  }, [])

  return (
    <ul>
      <li><ChapterLink chapter={1} name="Verschlüsselungsverfahren"/></li>
      <li><QuizLink chapter={2} name="Quiz: Verschlüsselungsverfahren" quizType="encryption"/></li>
      <li><ChapterLink chapter={3} name="Caesar: Einführung"/></li>
      <li><ChapterLink chapter={4} name="Caesar: Anwendung"/></li>
      <li><QuizLink chapter={5} name="Quiz: Caesar-Verfahren" quizType="caesar"/></li>
      <li><ChapterLink chapter={6} name="Vigenère" /></li>
    </ul>
  )
}

export default Side
