import { useEffect } from 'react'
import { useState } from 'react'
import './Caesar.css'

function Caesar() {

  const [alphabet, setAlphabet] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
  const [alphabetShifted, setAlphabetShifted] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])

  const [shift, setShift] = useState(0)

  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(() => {
      if (input.length <= 0) return ''
      return caesarShift(input)
    })
    shiftAlphabet()
  }, [input, shift])


  function caesarShift(text) {
    return text.split("").map(
      (letter) => {
        if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90
          || letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122) {
        let base = "a".charCodeAt(0)
        if (letter.toUpperCase() === letter) {
          base = "A".charCodeAt(0)
        }
        return String.fromCharCode((letter.charCodeAt(0) + shift + 26 - base) % 26 + base);
      } else {
        return letter
      }
      }).join("")

  }
  
  function shiftAlphabet() {
  setAlphabetShifted(
    (alphabetShifted) => {
      return alphabetShifted.map(
        (_, index) => {
          return alphabet[(index + shift + 26) % 26]
        })
      })
    }

  return (
    <>
      <div>Caesar mit Verschiebung: 
        <input type="number" onChange={(e) => setShift(e.target.value)} value={shift}/>
      </div>
      <div className="controls">
        <button onClick={() => setShift((shift) => (shift - 1) % 26)}>-1</button>
        <button onClick={() => setShift(0)}>Reset</button>
        <button onClick={() => setShift((shift) => (shift + 1) % 26)}>+1</button>
      </div>
      <div className="alphabet">
        {alphabet.map((letter, index) => <div className="letter" key={index}>{letter}</div>)}
      </div>
      <div className="alphabet">
        {alphabetShifted.map((letter, index) => <div className="letter" key={index}>{letter}</div>)}
      </div>

      <div className='input-area'>
        <label htmlFor="clear-text-field">Eingabe:</label>
        <input 
          onChange={(e) => setInput(e.target.value)}
          type="text"
          value={input}
          id="clear-text-field" />
      </div>

      <div className='output-area'>
        <label htmlFor="output-text-field">Ausgabe:</label>
        <input 
          onChange={(e) => setOutput(e.target.value)}
          type="text"
          value={output}
          id="output-text-field" />
      </div>
    </>
  )
}

export default Caesar