import ChapterLink from './ChapterLink'
import QuizLink from './QuizLink'
import './Side.css'
import {useContext} from 'react'
import {AppContext} from './App'
import { useEffect, useState } from 'react'

function Side() {

  const {setMaxChapter} = useContext(AppContext)
  useEffect(() => {
    setMaxChapter(14)
  }, [])

  return (
    <ul className="side-nav">
      <li><ChapterLink chapter={1} name="Verschlüsselungsverfahren"/></li>
      <li><QuizLink chapter={2} name="Quiz: Verschlüsselungsverfahren" quizType="encryption"/></li>
      <li><ChapterLink chapter={3} name="Caesar: Einführung"/></li>
      <li><ChapterLink chapter={4} name="Caesar: Anwendung"/></li>
      <li><QuizLink chapter={5} name="Quiz: Caesar-Verfahren" quizType="caesar"/></li>
      <li><ChapterLink chapter={6} name="Vigenère: Einführung" /></li>
      <li><ChapterLink chapter={7} name="Vigenère: Anwendung" /></li>
      <li><QuizLink chapter={8} name="Quiz: Vigenère-Verfahren" quizType="vigenere"/></li>
      <li><ChapterLink chapter={9} name="Diffie-Hellman: Einführung" /></li>
      <li><ChapterLink chapter={10} name="Diffie-Hellman: Anwendung" /></li>
      <li><QuizLink chapter={11} name="Quiz: Diffie-Hellman" quizType="diffie-hellman"/></li>
      <li><ChapterLink chapter={12} name="AES: Einführung" /></li>
      <li><ChapterLink chapter={13} name="AES: Anwendung" /></li>
      <li><QuizLink chapter={14} name="Quiz: AES" quizType="aes"/></li>
    </ul>
  )
}

export default Side
