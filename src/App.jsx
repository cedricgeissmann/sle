import './App.css'
import Nav from './Nav.jsx'
import Main from './Main.jsx'
import Side from './Side.jsx'

import useStorage from './useStorage'

import {createContext, useState} from 'react'

export const AppContext = createContext(null)
function App() {

  const [chapter, setChapter] = useStorage('chapter', 1)
  const [finishedChapter, setFinishedChapter] = useStorage('finishedChapter', 0)
  const [maxChapter, setMaxChapter] = useState(0)


  return (
    <>
      <Nav />
      <AppContext.Provider value={{chapter, setChapter, finishedChapter, setFinishedChapter, maxChapter, setMaxChapter}}>
        <div className='container'>
          <Side />
          <Main />
        </div>
      </AppContext.Provider>
    </>
  )
}

export default App
