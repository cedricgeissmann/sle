import { useEffect } from 'react'
import { useState } from 'react'
import { Player } from '@remotion/player'
import './Caesar.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'

function LetterList({letters, gap, shiftInputUpwards, opacity, type, myClass}) {

  return (
    <div
      style={{
        position: "absolute",
        fontSize: "2rem",
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
      {letters.map((letter, index) => (
        <div
          className={myClass}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "2rem",
            maxHeight: "2rem",
            minWidth: "2rem",
            maxWidth: "2rem",
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

function ShiftAmount({shift, opacity}) {
  return (
    <div
      style={{
        color: "white",
        fontSize: "4rem",
        position: "absolute",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: `${opacity}`,
      }}
    >
      + {shift}
    </div>
  )
}


function CaesarVideo({input, shift, output}) {
  
  const frame = useCurrentFrame()
  
  const {durationInFrames} = useVideoConfig()
  const FPS = durationInFrames

  const animationSteps = [
    0,        // 
    0.025,    // 1: Fade in
    0.05,     // 2: Move up
    0.075,    // 3: Fade an shift alphabets
    0.1,      // 4: show shift

    0.125,
    0.15,
    0.175,
    0.2,

    0.225,
    0.25,
    0.275,
    0.3,

    0.325,
    0.35,
    0.375,
    0.4,

    0.425,
    0.45,
    0.475,
    0.5,

    0.525,
    0.55,
    0.575,
    0.6,

    0.625,
    0.65,
    0.675,
    0.7,

    0.725,
    0.75,
    0.775,
    0.8,

    0.825,
    0.85,
    0.875,
    0.9,

    0.925,
    0.95,
    0.975,
    1         //
  ]

  function step(num) {
    if (num > animationSteps.length - 1) return durationInFrames
    return Math.floor(animationSteps[num] * durationInFrames)
  }

  function inter(frames, values) {
    return interpolate(frame, frames.map((f) => step(f)), values, {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp'
    })
  }

  const [queue, setQueue] = useState(new Array())

  // Eingabe anzeigen und in Kästchen verteilen, dann nach oben schieben
  const opacity = inter([0, 1], [0, 1]);
  const shiftInputUpwards = inter([1, 2], [0, 40]);
  const gap = inter([1, 2], [0, 1]);

  const opacityAlphabet = inter([2, 3], [0, 1]);
  const translateAlphabet = inter([2, 3], [0, 15]);
  const opacityAlphabetShifted = inter([2, 3], [0, 1]);
  const translateAlphabetShifted = inter([2, 3], [0, 15]);

  const opacityShift = inter([3, 4], [0, 1]);

  const opacityOutput = inter([4, 5], [0, 1]);

  const [inputString, setInputString] = useState(input.split(""))
  const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz".split(""))
  const [alphabetShifted, setAlphabetShifted] = useState("abcdefghijklmnopqrstuvwxyz".split(""))

  const [arrows, setArrows] = useState([])
  
  function shiftAlphabet() {
    setAlphabetShifted(alphabetShifted => {
      return alphabetShifted.map((_, index) => {
        return alphabet[(index + shift + 26) % 26]
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

  useEffect(() => {
    const base = 4
    const numSteps = 4
    for (let i = 0; i < inputString.length; i++) {
      
      // Mark the first letter in the word
      addToQueue(step(base + i*numSteps + 2), () => {
        if (i > 0) {
          // cleanup from last iteration
          const letter = document.querySelectorAll('.video-letter')[i-1]
          letter.style.color = "white"
          letter.style.border = "1px solid white"
          const alphabetIndex = letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
          const alphabetLetter = document.querySelectorAll('.video-letter-alphabet')[alphabetIndex]
          alphabetLetter.style.color = "white"
          alphabetLetter.style.border = "1px solid white"
          const alphabetLetterShifted = document.querySelectorAll('.video-letter-alphabet-shifted')[alphabetIndex]
          alphabetLetterShifted.style.color = "white"
          alphabetLetterShifted.style.border = "1px solid white"
          const outLetter = document.querySelectorAll('.output-letter')[i-1]
          outLetter.style.color = "white"
          outLetter.style.border = "1px solid white"
        }
        const letter = document.querySelectorAll('.video-letter')[i]
        letter.style.color = "red"
        letter.style.border = "2px solid red"
      })

      // Mark this letter in the alphabet
      addToQueue(step(base + i*numSteps + 3), () => {
        const letter = document.querySelectorAll('.video-letter')[i]
        const alphabetIndex = letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
        const alphabetLetter = document.querySelectorAll('.video-letter-alphabet')[alphabetIndex]
        alphabetLetter.style.color = "red"
        alphabetLetter.style.border = "2px solid red"
      })

      // Mark this letter in the shifted alphabet
      addToQueue(step(base + i*numSteps + 4), () => {
        const letter = document.querySelectorAll('.video-letter')[i]
        const alphabetIndex = (letter.textContent.toLowerCase().charCodeAt(0) - "a".charCodeAt(0))
        const alphabetLetter = document.querySelectorAll('.video-letter-alphabet-shifted')[alphabetIndex]
        alphabetLetter.style.color = "red"
        alphabetLetter.style.border = "2px solid red"
      })

      // Mark this letter in the output
      addToQueue(step(base + i*numSteps + 5), () => {
        const letter = document.querySelectorAll('.output-letter')[i]
        letter.style.color = "red"
        letter.style.border = "2px solid red"
      })
    }
  }, [])
  
  useEffect(() => {
    shiftAlphabet()
  }, [shift])
  
  useEffect(() => {
    setInputString(input.split(""))
  }, [input])
  
  useEffect(() => {
    console.log(arrows)
    queue.forEach((item) => {
      if (item.frame === frame) {
        item.callback(frame)
        queue.splice(queue.indexOf(item), 1)
      }
    })
  }, [frame])
  
  return (
    <>
      <Sequence from={0} durationInFrames={1 * FPS}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <LetterList myClass="video-letter" type="input" letters={inputString} gap={gap} opacity={opacity} shiftInputUpwards={shiftInputUpwards} />
          <LetterList myClass="video-letter-alphabet" type="alphabet" letters={alphabet} gap={0.5} opacity={opacityAlphabet} shiftInputUpwards={translateAlphabet} />
          <LetterList myClass="video-letter-alphabet-shifted" type="alphabet-shifted" letters={alphabetShifted} gap={0.5} opacity={opacityAlphabetShifted} shiftInputUpwards={-translateAlphabetShifted} />
          <LetterList myClass="output-letter" type="output-letter" letters={output.split("")} gap={0.5} opacity={0} shiftInputUpwards={-30} />

          <ShiftAmount shift={shift} opacity={opacityShift} />
          
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
      <div>Caesar mit Verschiebung: 
        <input type="number" onChange={(e) => setShift(e.target.value)} value={shift}/>
      </div>
      <div className="controls">
        <button onClick={() => setShift((shift) => (shift - 1) % 26)}>-1</button>
        <button onClick={() => setShift(0)}>Reset</button>
        <button onClick={() => setShift((shift) => (shift + 1) % 26)}>+1</button>
      </div>

      <div className='input-area'>
        <label htmlFor="clear-text-field">Eingabe:</label>
        <input 
          onChange={(e) => setInput(e.target.value)}
          type="text"
          value={input}
          id="clear-text-field" />
      </div>


      <div className="video-container">
        <Player
          style={{width: '90%'}}
          component={CaesarVideo}
          durationInFrames={6*30}
          compositionWidth={1280}
          compositionHeight={720}
          fps={30}
          autoPlay={true}
          controls
          inputProps={{input, shift, output}}
        />
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