import './App.css'
import Nav from './Nav.jsx'
import Main from './Main.jsx'
import Side from './Side.jsx'

import useStorage from './useStorage'

import {createContext} from 'react'

export const AppContext = createContext(null)
function App() {

  const [chapter, setChapter] = useStorage('chapter', 1)
  const [finishedChapter, setFinishedChapter] = useStorage('finishedChapter', 0)


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
