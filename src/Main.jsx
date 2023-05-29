import './Main.css'
import {AppContext} from './App.jsx'
import { useContext } from 'react'
import Caesar from './Caesar.jsx'
import Quiz from './Quiz.jsx'
import Vigenere from './Vigenere.jsx'
import Verschluesselung from './Verschluesselung'
import DiffieHellman from './DiffieHellman'

function Main() {

  const {chapter, setChapter, finishedChapter, setFinishedChapter, maxChapter} = useContext(AppContext)

  function nextChapter() {
    if (chapter >= maxChapter) return
    setChapter((chapter) => chapter + 1)
    if (chapter > finishedChapter) {
      setFinishedChapter(chapter)
    }
  }

  function prevChapter() {
    if (chapter <= 1) return
    setChapter((chapter) => chapter - 1)
  }

  return (
    <main>
      <div className="chapter">
      <h2>Chapter {chapter}</h2>
      <section>
        {chapter === 1 &&
          <Verschluesselung />
        }
        {chapter === 2 &&
          <Caesar />
        }
        {chapter === 3 &&
          <Quiz quizType={'caesar'}/>
        }
        {chapter === 4 &&
          <Vigenere />
        }
        {chapter === 5 &&
          <DiffieHellman />
        }
      </section>
      </div>

      <div className='footer'>
        <button id='btn-prev' onClick={prevChapter}>Zurück</button>
        <button id='btn-next' onClick={nextChapter}>Weiter</button>
      </div>
    </main>
  )
}

export default Main
