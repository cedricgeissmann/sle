import './Main.css'
import {AppContext} from './App.jsx'
import { useContext } from 'react'

function Main() {

  const chapterContext = useContext(AppContext)

  function nextChapter() {
    if (chapterContext.chapter >= chapterContext.maxChapter) return
    chapterContext.setChapter((chapter) => chapter + 1)
    if (chapterContext.chapter > chapterContext.finishedChapter) {
      chapterContext.setFinishedChapter(chapterContext.chapter)
    }
  }

  function prevChapter() {
    if (chapterContext.chapter <= 1) return
    chapterContext.setChapter((chapter) => chapter - 1)
  }

  return (
    <main>
      <div className="chapter">
      <h2>Chapter {chapterContext.chapter}</h2>
      </div>

      <div className='footer'>
        <button onClick={prevChapter}>Zurück</button>
        <button onClick={nextChapter}>Weiter</button>
      </div>
    </main>
  )
}

export default Main
