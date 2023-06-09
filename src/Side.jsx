import ChapterLink from './ChapterLink'
import QuizLink from './QuizLink'
import './Side.css'
import {useContext} from 'react'
import {AppContext} from './App'
import { useEffect, useState } from 'react'

function Side() {

  const {setMaxChapter} = useContext(AppContext)
  useEffect(() => {
    setMaxChapter(10)
  }, [])

  return (
    <ul>
      <li><ChapterLink chapter={1} name="Verschlüsselungsverfahren"/></li>
      <li><QuizLink chapter={2} name="Quiz: Verschlüsselungsverfahren" quizType="encryption"/></li>
      <li><ChapterLink chapter={3} name="Caesar: Einführung"/></li>
      <li><ChapterLink chapter={4} name="Caesar: Anwendung"/></li>
      <li><QuizLink chapter={5} name="Quiz: Caesar-Verfahren" quizType="caesar"/></li>
      <li><ChapterLink chapter={6} name="Vigenère: Einführung" /></li>
      <li><ChapterLink chapter={7} name="Vigenère: Anwendung" /></li>
      <li><QuizLink chapter={8} name="Quiz: Vigenère-Verfahren" quizType="vigenere"/></li>
    </ul>
  )
}

export default Side
