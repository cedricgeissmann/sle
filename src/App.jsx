import './App.css'
import Nav from './Nav.jsx'
import Main from './Main.jsx'
import Side from './Side.jsx'

import {useState} from 'react'

function App() {

  const [chapter, setChapter] = useState(1)

  return (
    <>
      <Nav />
      <div className='container'>
        <Side chapter={chapter} onChapterChange={setChapter} />
        <Main chapter={chapter} />
      </div>
    </>
  )
}

export default App
