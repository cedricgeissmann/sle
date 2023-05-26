import { useState, useEffect, createContext, useContext } from 'react'
import './CaesarQuiz.css'

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

function CaesarQuiz() {

  const [questions, setQuestions] = useState(QUESTIONS)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    console.log(points)
  }, [points])

  function evaluateQuiz(e) {
    e.preventDefault()
    setPoints(0)
    questions.map(question => {
      question.answers.map(answer => {
        if (answer.checked === true && answer.correct === true) {
          setPoints(currentPoints => {
            return currentPoints + 1
          })
        }
      })
    })
  }

  function answerSelected(e, i, j) {
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
          <div key={`question-${i}`}>
            <h4>{question.question}</h4>
            {question.answers.map((answer, j) => (
              <div key={`q${i}-a${j}`}>
                <input onClick={(e) => answerSelected(e, i, j)} type="radio" id={`q${i}-a${j}`} name={`question-${i}`} />
                <label htmlFor={`q${i}-a${j}`}>
                  {answer.text}
                </label> <br/>
              </div>
            ))}
          </div>
        ))}
        <button className="btn-submit" type="submit">Fertig</button>
      </form>
      
    </>
  )
}

export default CaesarQuiz