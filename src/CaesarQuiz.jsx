import { useState, useEffect } from 'react'
import './CaesarQuiz.css'
import { getSessionStorageOrDefault } from './utils'

const QUESTIONS = [
  {
    question: 'Das Caesarverfahren kann verwendet werden um einen Text zu verschlüsseln.',
    answers: [{
      text: "Ja",
      checked: false,
      correct: true
    }, {
      text: "Nein",
      checked: false,
      correct: false
    }]
  }, {
    question: 'Das Caesarverfahren gilt als sicheres Verschlüsselungverfahren.',
    answers: [{
      text: "Ja",
      checked: false,
      correct: false
    }, {
      text: "Nein",
      checked: false,
      correct: true
    }]
  }, {
    question: 'Der Schlüsselraum für das Caesarverfahren ist 26 Elemente gross.',
    answers: [{
      text: "Ja",
      checked: false,
      correct: true
    }, {
      text: "Nein",
      checked: false,
      correct: false
    }]
  }

]


function updateListEntry(list, index, cb) {
  return list.map((item, i) => {
    if (i === index) {
      return cb(item)
    } else {
      return item
    }
  })
}

function Questions({question, index, answerSelected}) {

  const [answers, setAnswers] = useState(question.answers)

  useEffect(() => {
    console.log(answers)
  })

  let bgColor = 'rgba(255, 255, 255, 0.2)'
  if (question.correct === true) {
    bgColor = 'rgba(0, 255, 0, 0.2)'
  } else if (question.correct === false) {
    bgColor = 'rgba(255, 0, 0, 0.2)'
  }
  const style={
    backgroundColor: bgColor,
  }

  return (
    <div key={`question-${index}`}>
      <h4>{question.question}</h4>
      <div style={style}>
      {answers.map((answer, j) => (
        <div key={`q${index}-a${j}`}>
          <input onClick={e => answerSelected(e, index, j)} type="radio" id={`q${index}-a${j}`} name={`question-${index}`} />
          <label htmlFor={`q${index}-a${j}`}>{answer.text}</label> <br />
        </div>

      ))}
      </div>
    </div>
  )
}

function CaesarQuiz() {

  const [questions, setQuestions] = useState(QUESTIONS)
  const [points, setPoints] = useState(getSessionStorageOrDefault('quiz-caesar-points', 0))

  useEffect(() => {
    sessionStorage.setItem('quiz-caesar-points', points)
  }, [points])

  function checkAnswer(question) {
    const len = question.answers.filter(answer => answer.checked === true && answer.correct === true).length
    return len
  }

  function evaluateQuiz(e) {
    e.preventDefault()
    setPoints(0)
    questions.forEach(question => {
      const correctAnswers = checkAnswer(question)
      setPoints(points => points + correctAnswers)
    })
    setQuestions((currentQuestions) => currentQuestions.map(question => {
      const len = checkAnswer(question)
      const checked = question.answers.filter(answer => answer.checked === true).length
      if (checked > 0) {
        return {...question, correct: len > 0 }
      } else {
        return question
      }
    })
    )
  }

  function answerSelected(e, i, j) {
    console.log(e.target.parentElement.parentElement)
    setQuestions((currentQuestions) => {
      return currentQuestions.map((question, index) => {
        if (index === i) {
          return {...question, answers: question.answers.map((answer, answerIndex) => {
            if (answerIndex === j) {
              return {...answer, checked: true}
            } else {
              return {...answer, checked: false}
            }
          })}
        } else {
          return question
        }
      })
    })
  }

  return (
    <>
      <h3><span>Caesar Quiz</span><span>Punkte: {points}/{questions.length}</span></h3>
      <form onSubmit={(e) => evaluateQuiz(e)}>
        {questions.map((question, i) => (
          <Questions question={question} index={i} key={`question-${i}`} answerSelected={answerSelected} />
        ))}
        <button className="btn-submit" type="submit">Fertig</button>
      </form>
      
    </>
  )
}

export default CaesarQuiz