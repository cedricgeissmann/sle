import { useEffect } from 'react'
import { useState } from 'react'
import { Player } from '@remotion/player'
import './Caesar.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'


function CaesarVideo({input}) {
  
  const frame = useCurrentFrame()
  
  const {durationInFrames} = useVideoConfig()
  const FPS = durationInFrames

  const opacity = interpolate(frame, [0, 0.5*FPS], [0, 1]);
  const opacityAlphabet = interpolate(frame, [0.5*FPS, 1*FPS], [0, 1]);
  const translateAlphabet = interpolate(frame, [0.5*FPS, 1*FPS], [0, 10]);
  const opacityAlphabetShifted = interpolate(frame, [0.5*FPS, 1*FPS], [0, 1]);
  const translateAlphabetShifted = interpolate(frame, [0.5*FPS, 1*FPS], [0, 10]);
  const gap = interpolate(frame, [0, 0.5*FPS, 1*FPS], [0, 0, 1]);
  const shiftInputUpwards = interpolate(frame, [0, 0.5*FPS, 1*FPS], [0, 0, 50]);

  const [inputString, setInputString] = useState(input.split(""))
  const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  const [alphabetShifted, setAlphabetShifted] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  
  useEffect(() => {
    setInputString(input.split(""))
  }, [input])

  useEffect(() => {
    if (frame === 0.5*FPS- 1) {
      const letter = document.querySelectorAll('.video-letter')[0]
      letter.style.color = "red"
      letter.style.border = "2px solid red"
    }
    if (frame === 0.5*FPS) {

      
    }
  }, [frame])

  return (
    <>
      <Sequence from={0} durationInFrames={1 * FPS}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <div
            style={{
              position: "absolute",
              fontSize: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              color: "white",
              gap: `${gap}rem`,
              transform: `translateY(${-shiftInputUpwards}%)`,
            }}
          >
            {inputString.map((letter, index) => (
              <div
                className="video-letter"
                style={{
                  color: "white",
                  border: `1px solid rgba(255, 255, 255, ${opacity})`,
                }}
                key={`input-${index}`}
              >
                {letter}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              fontSize: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              color: "white",
              gap: `0.5rem`,
              opacity: `${opacityAlphabet}`,
              transform: `translateY(${-translateAlphabet}%)`,
            }}
          >
            {alphabet.map((letter, index) => (
              <div
                className="video-letter-alphabet"
                style={{
                  color: "white",
                  border: `1px solid rgba(255, 255, 255, ${opacityAlphabet})`,
                }}
                key={`alphabet-${index}`}
              >
                {letter}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              fontSize: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              color: "white",
              gap: `0.5rem`,
              opacity: `${opacityAlphabetShifted}`,
              transform: `translateY(${translateAlphabetShifted}%)`,
            }}
          >
            {alphabetShifted.map((letter, index) => (
              <div
                className="video-letter-alphabet-shifted"
                style={{
                  color: "white",
                  border: `1px solid rgba(255, 255, 255, ${opacityAlphabetShifted})`,
                }}
                key={`alphabet-${index}`}
              >
                {letter}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={1 * FPS} durationInFrames={2 * FPS}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <h1>Caesar</h1>
        </AbsoluteFill>
      </Sequence>
    </>
  )
}

function Caesar() {

  const [alphabet, setAlphabet] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
  const [alphabetShifted, setAlphabetShifted] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])

  const [shift, setShift] = useState(0)

  const [input, setInput] = useState('this is a very long string')
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

      <div className="video-container">
        <Player
          style={{width: '90%'}}
          component={CaesarVideo}
          durationInFrames={3*30}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          autoPlay={true}
          controls
          inputProps={{input}}
        />
      </div>
    </>
  )
}

export default Caesar