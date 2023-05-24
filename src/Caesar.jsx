import { useEffect } from 'react'
import { useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Caesar.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'

export const CaesarContext = createContext(null)

function LetterList({letters, gap, shiftInputUpwards, opacity, type, myClass}) {

  return (
    <div className="letter-list"
      style={{
        gap: `${gap}rem`,
        transform: `translateY(${-shiftInputUpwards}%)`,
      }}
    >
      {letters.map((letter, index) => (
        <div
          className={`${myClass} video-letter`}
          style={{
            color: `rgba(255, 255, 255, ${opacity}`,
            border: `1px solid rgba(255, 255, 255, ${opacity})`,
          }}
          key={`${type}-${index}`}
          id={`${type}-${index}`}
        >
          {letter}
        </div>
      ))}
    </div>
  )
}

function ShiftAmount({opacity}) {
  const caesarContext = useContext(CaesarContext)
  return (
    <div
      className='shift-amount'
      style={{
        opacity: `${opacity}`,
      }}
    >
      + {caesarContext.shift}
    </div>
  )
}

function IntroSequence() {
  const caesarContext = useContext(CaesarContext)
  const [inputString, setInputString] = useState(caesarContext.input.split(""))
  const frame = useCurrentFrame()
  
  const opacity = inter(frame, [0, 1], [0, 1]);
  const shiftInputUpwards = inter(frame, [1, 2], [0, 40]);
  const gap = inter(frame, [1, 2], [0, 1]);

  const opacityAlphabet = inter(frame, [2, 3], [0, 1]);
  const translateAlphabet = inter(frame, [2, 3], [0, 15]);
  const opacityAlphabetShifted = inter(frame, [2, 3], [0, 1]);
  const translateAlphabetShifted = inter(frame, [2, 3], [0, 15]);

  const opacityShift = inter(frame, [3, 4], [0, 1]);

  const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  const [alphabetShifted, setAlphabetShifted] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  return (
      <Sequence from={0} durationInFrames={2 * 30}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <LetterList myClass="video-letter" type="input" letters={inputString} gap={gap} opacity={opacity} shiftInputUpwards={shiftInputUpwards} />
          <LetterList myClass="video-letter-alphabet" type="alphabet" letters={alphabet} gap={0.5} opacity={opacityAlphabet} shiftInputUpwards={translateAlphabet} />
          <LetterList myClass="video-letter-alphabet-shifted" type="alphabet-shifted" letters={alphabetShifted} gap={0.5} opacity={opacityAlphabetShifted} shiftInputUpwards={-translateAlphabetShifted} />
          <LetterList myClass="output-letter" type="output-letter" letters={caesarContext.output.split("")} gap={0.5} opacity={0} shiftInputUpwards={-30} />
          <ShiftAmount opacity={opacityShift} />
        </AbsoluteFill>
      </Sequence>
  )
}

function MidSequence() {
  const caesarContext = useContext(CaesarContext)
  const [inputString, setInputString] = useState(caesarContext.input.split(""))
  const frame = useCurrentFrame()
  const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  const [alphabetShifted, setAlphabetShifted] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  return (
    <Sequence from={2 * 30} durationInFrames={6 * 30}>
      <AbsoluteFill style={{backgroundColor: "#000"}}>
        <LetterList
          myClass="video-letter"
          type="input"
          letters={inputString}
          gap={1}
          opacity={1}
          shiftInputUpwards={40}
        />
        <LetterList
          myClass="video-letter-alphabet"
          type="alphabet"
          letters={alphabet}
          gap={0.5}
          opacity={1}
          shiftInputUpwards={15}
        />
        <LetterList
          myClass="video-letter-alphabet-shifted"
          type="alphabet-shifted"
          letters={alphabetShifted}
          gap={0.5}
          opacity={1}
          shiftInputUpwards={-15}
        />
        <LetterList
          myClass="output-letter"
          type="output-letter"
          letters={caesarContext.output.split("")}
          gap={0.5}
          opacity={0}
          shiftInputUpwards={-30}
        />
        <ShiftAmount opacity={1} />
      </AbsoluteFill>
    </Sequence>
  )
}

function inter(frame, frames, values) {
  return interpolate(frame, frames.map((f) => f * 15), values, {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp'
  })
}

function CaesarVideo() {
  
  const frame = useCurrentFrame()

  const caesarContext = useContext(CaesarContext)
  
  const {durationInFrames} = useVideoConfig()

  const [queue, setQueue] = useState(new Array())

  const [inputString, setInputString] = useState(caesarContext.input.split(""))
  const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  const [alphabetShifted, setAlphabetShifted] = useState("abcdefghijklmnopqrstuvwxyz".split(""))

  
  function shiftAlphabet() {
    setAlphabetShifted(alphabetShifted => {
      return alphabetShifted.map((_, index) => {
        return alphabet[(index + caesarContext.shift + 26) % 26]
      })
    })
  }

  function addToQueue(frame, cb) {
    setQueue((queue) => {
      return queue.concat({
        frame: frame,
        callback: cb
      })
    })
  }

  useEffect(() => {
    setAlphabet((alphabet) => {
      return alphabet
    })
  }, [])

  // useEffect(() => {
  //   const base = 4
  //   const numSteps = 4
  //   for (let i = 0; i < inputString.length; i++) {
      
  //     // Mark the first letter in the word
  //     addToQueue(step(base + i*numSteps + 2), () => {
  //       if (i > 0) {
  //         // cleanup from last iteration
  //         const letter = document.querySelectorAll('.video-letter')[i-1]
  //         letter.style.color = "white"
  //         letter.style.border = "1px solid white"
  //         const alphabetIndex = letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
  //         const alphabetLetter = document.querySelectorAll('.video-letter-alphabet')[alphabetIndex]
  //         alphabetLetter.style.color = "white"
  //         alphabetLetter.style.border = "1px solid white"
  //         const alphabetLetterShifted = document.querySelectorAll('.video-letter-alphabet-shifted')[alphabetIndex]
  //         alphabetLetterShifted.style.color = "white"
  //         alphabetLetterShifted.style.border = "1px solid white"
  //         const outLetter = document.querySelectorAll('.output-letter')[i-1]
  //         outLetter.style.color = "white"
  //         outLetter.style.border = "1px solid white"
  //       }
  //       const letter = document.querySelectorAll('.video-letter')[i]
  //       letter.style.color = "red"
  //       letter.style.border = "2px solid red"
  //     })

  //     // Mark this letter in the alphabet
  //     addToQueue(step(base + i*numSteps + 3), () => {
  //       const letter = document.querySelectorAll('.video-letter')[i]
  //       const alphabetIndex = letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
  //       const alphabetLetter = document.querySelectorAll('.video-letter-alphabet')[alphabetIndex]
  //       alphabetLetter.style.color = "red"
  //       alphabetLetter.style.border = "2px solid red"
  //     })

  //     // Mark this letter in the shifted alphabet
  //     addToQueue(step(base + i*numSteps + 4), () => {
  //       const letter = document.querySelectorAll('.video-letter')[i]
  //       const alphabetIndex = (letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0))
  //       const alphabetLetter = document.querySelectorAll('.video-letter-alphabet-shifted')[alphabetIndex]
  //       alphabetLetter.style.color = "red"
  //       alphabetLetter.style.border = "2px solid red"
  //     })

  //     // Mark this letter in the output
  //     addToQueue(step(base + i*numSteps + 5), () => {
  //       const letter = document.querySelectorAll('.output-letter')[i]
  //       letter.style.color = "red"
  //       letter.style.border = "2px solid red"
  //     })
  //   }
  // }, [])
  
  useEffect(() => {
    shiftAlphabet()
  }, [caesarContext.shift])
  
  useEffect(() => {
    setInputString(caesarContext.input.split(""))
  }, [caesarContext.input])
  
  useEffect(() => {
    queue.forEach((item) => {
      if (item.frame === frame) {
        item.callback(frame)
        queue.splice(queue.indexOf(item), 1)
      }
    })
  }, [frame])
  
  return (
    <>
      <IntroSequence />

      <MidSequence />

      {/*<Sequence from={6 * 30} durationInFrames={8*30}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <LetterList myClass="video-letter" type="input" letters={inputString} gap={gap} opacity={opacity} shiftInputUpwards={shiftInputUpwards} />
          <LetterList myClass="video-letter-alphabet" type="alphabet" letters={alphabet} gap={0.5} opacity={opacityAlphabet} shiftInputUpwards={translateAlphabet} />
          <LetterList myClass="video-letter-alphabet-shifted" type="alphabet-shifted" letters={alphabetShifted} gap={0.5} opacity={opacityAlphabetShifted} shiftInputUpwards={-translateAlphabetShifted} />
          <LetterList myClass="output-letter" type="output-letter" letters={caesarContext.output.split("")} gap={0.5} opacity={0} shiftInputUpwards={-30} />
          <ShiftAmount opacity={opacityShift} />
        </AbsoluteFill>
      </Sequence> */}
    </>
  )
}

function Caesar() {

  const [alphabet, setAlphabet] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
  const [alphabetShifted, setAlphabetShifted] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])

  const [shift, setShift] = useState(18)

  const [input, setInput] = useState('thisisaverysecuremessage')
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
      <CaesarContext.Provider value={{input, shift, output}}>
        <div>
          Caesar mit Verschiebung:
          <input type="number" onChange={e => setShift(e.target.value)} value={shift} />
        </div>
        <div className="controls">
          <button onClick={() => setShift(shift => (shift - 1) % 26)}>-1</button>
          <button onClick={() => setShift(0)}>Reset</button>
          <button onClick={() => setShift(shift => (shift + 1) % 26)}>+1</button>
        </div>

        <div className="input-area">
          <label htmlFor="clear-text-field">Eingabe:</label>
          <input onChange={e => setInput(e.target.value)} type="text" value={input} id="clear-text-field" />
        </div>

        <div className="video-container">
          <Player
            style={{width: "90%"}}
            component={CaesarVideo}
            durationInFrames={8 * 30}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay={true}
            controls
          />
        </div>
        <div className="output-area">
          <label htmlFor="output-text-field">Ausgabe:</label>
          <input onChange={e => setOutput(e.target.value)} type="text" value={output} id="output-text-field" />
        </div>
      </CaesarContext.Provider>
    </>
  )
}

export default Caesar