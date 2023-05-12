import './App.css'
import Nav from './Nav.jsx'
import Main from './Main.jsx'
import Side from './Side.jsx'

import {getSessionStorageOrDefault} from './utils.js'

import {useEffect, useState} from 'react'

function App() {

  const [chapter, setChapter] = useState(
    getSessionStorageOrDefault('chapter', 1)
  )
  useEffect(() => {
    sessionStorage.setItem('chapter', chapter)
  }, [chapter])

  const [finishedChapter, setFinishedChapter] = useState(
    getSessionStorageOrDefault('finishedChapter', 0)
  )
  useEffect(() => {
    sessionStorage.setItem('finishedChapter', finishedChapter)
  }, [finishedChapter])


  return (
    <>
      <Nav />
      <div className='container'>
        <Side chapter={chapter} onChapterChange={setChapter} />
        <Main chapter={chapter} onChapterChange={setChapter} onChapterFinish={setFinishedChapter} />
      </div>
    </>
  )
}

export default App
