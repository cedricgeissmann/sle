import { useEffect } from 'react'
import { useState } from 'react'
import './Vigenere.css'

function Vigenere() {

  const [keyword, setKeyword] = useState('averysecurekeyword')

  const [input, setInput] = useState('Dieser Text wird verschlüsselt.')
  const [output, setOutput] = useState('')

  useEffect(() => {
    setOutput(() => {
      if (input.length <= 0) return ''
      return caesarShift(input)
    })
  }, [input, keyword])


  function caesarShift(text) {
    let keyIndex = 0;
    return text.split("").map(
      (letter) => {
        if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90
          || letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122) {
        let base = "a".charCodeAt(0)
        if (letter.toUpperCase() === letter) {
          base = "A".charCodeAt(0)
        }
        let shift = keyword.toLowerCase().charCodeAt(keyIndex) - "a".charCodeAt(0);
        const char = String.fromCharCode((letter.charCodeAt(0) + shift + 26 - base) % 26 + base);
        keyIndex = (keyIndex + 1) % (keyword.length)
        return char
      } else {
        return letter
      }
      }).join("")

  }

  return (
    <>
      <div>Vigenere mit Schlüsselwort: 
        <input type="text" onChange={(e) => setKeyword(e.target.value)} value={keyword}/>
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

export default Vigenere