import './Main.css'
import {AppContext} from './App.jsx'
import { useContext } from 'react'
import Caesar from './Caesar.jsx'
import Quiz from './Quiz.jsx'
import Vigenere from './Vigenere.jsx'
import Verschluesselung from './Verschluesselung'
import DiffieHellman from './DiffieHellman'
import AES from './AES'
import CaesarIntro from './CaesarIntro'

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
          <Quiz quizType={'encryption'} />
        }
        {chapter === 3 &&
          <CaesarIntro />
        }
        {chapter === 4 &&
          <Caesar />
        }
        {chapter === 5 &&
          <Quiz quizType={'caesar'}/>
        }
        {chapter === 6 &&
          <Vigenere />
        }
        {chapter === 7 &&
          <DiffieHellman />
        }
        {chapter === 8 &&
          <AES />
        }
      </section>
      </div>

      <div className='footer'>
        {chapter > 1 &&
          <button id='btn-prev' onClick={prevChapter} disabled={chapter <= 1}>Zurück</button>
        }
        {chapter <= 1 &&
          <span></span>
        }
        {chapter < maxChapter &&
          <button id='btn-next' onClick={nextChapter}>Weiter</button>
        }
      </div>
    </main>
  )
}

export default Main
