import './Main.css'

function Main({chapter, onChapterChange, onChapterFinish}) {

  function nextChapter() {
    if (chapter >= 4) return
    onChapterChange(chapter + 1)
    onChapterFinish(chapter + 1)
  }

  function prevChapter() {
    if (chapter <= 1) return
    onChapterChange(chapter - 1)
  }

  return (
    <main>
      <div className="chapter">
      <h2>Chapter {chapter}</h2>
      </div>

      <div className='footer'>
        <button onClick={prevChapter}>Zurück</button>
        <button onClick={nextChapter}>Weiter</button>
      </div>
    </main>
  )
}

export default Main
