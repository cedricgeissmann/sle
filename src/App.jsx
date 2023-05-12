import './App.css'
import Nav from './Nav.jsx'
import Main from './Main.jsx'
import Side from './Side.jsx'

import {getSessionStorageOrDefault} from './utils.js'

import {createContext, useEffect, useState} from 'react'

export const AppContext = createContext(null)
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
      <AppContext.Provider value={{chapter, setChapter, finishedChapter, setFinishedChapter, maxChapter: 5}}>
        <div className='container'>
          <Side />
          <Main />
        </div>
      </AppContext.Provider>
    </>
  )
}

export default App
