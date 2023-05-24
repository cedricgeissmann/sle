import { useEffect } from 'react'
import { useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Caesar.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'

export const CaesarContext = createContext(null)

function highlightLetter(currentLetter, alphabet, setAlphabet, shift = 0) {
  console.log(currentLetter.charCodeAt(0))
  if (currentLetter.charCodeAt(0) >= 97 && currentLetter.charCodeAt(0) <= 122) {
  const alphabetIndex = alphabet.findIndex(l => l.letter === currentLetter)
  const idx = (alphabetIndex + shift + 26) % 26
  setAlphabet((currentAlphabet) => (
    currentAlphabet.map((item, index) => {
      return index === idx ? {...item, active: true} : {...item, active: false}
    })
  ))
  }
}

function Letter({letter, opacity, myClass}) {

  const [style, setStyle] = useState({
    color: `rgba(255, 255, 255, ${opacity}`,
    border: `1px solid rgba(255, 255, 255, ${opacity})`,
  })

  useEffect(() => {
    if (letter.active) {
      setStyle({
        color: `rgba(255, 0, 0, ${opacity})`,
        border: `2px solid rgba(255, 0, 0, ${opacity})`,
      })
    } else {
      setStyle({
        color: `rgba(255, 255, 255, ${opacity}`,
        border: `1px solid rgba(255, 255, 255, ${opacity})`,
      })
    }
  }, [letter.active, opacity])

  return (
    <div
      className={`${myClass} video-letter`}
      style={style}
    >
      {letter.letter}
    </div>
  )
}

function LetterList({letters, gap, shiftInputUpwards, opacity, type, myClass}) {

  return (
    <div className="letter-list"
      style={{
        gap: `${gap}rem`,
        transform: `translateY(${-shiftInputUpwards}%)`,
      }}
    >
      {letters.map((letter, index) => (
        <Letter letter={letter} opacity={opacity} key={`${type}-${index}`} type={type} myClass={myClass} />
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
  const {input, alphabet, alphabetShifted} = useContext(CaesarContext)
  const frame = useCurrentFrame()
  
  const opacity = inter(frame, [0, 1], [0, 1]);
  const shiftInputUpwards = inter(frame, [1, 2], [0, 40]);
  const gap = inter(frame, [1, 2], [0, 1]);

  const opacityAlphabet = inter(frame, [2, 3], [0, 1]);
  const translateAlphabet = inter(frame, [2, 3], [0, 15]);
  const opacityAlphabetShifted = inter(frame, [2, 3], [0, 1]);
  const translateAlphabetShifted = inter(frame, [2, 3], [0, 15]);

  const opacityShift = inter(frame, [3, 4], [0, 1]);

  return (
      <Sequence from={0} durationInFrames={2 * 30}>
        <AbsoluteFill style={{backgroundColor: "#000"}}>
          <LetterList myClass="video-letter-input" type="input" letters={input} gap={gap} opacity={opacity} shiftInputUpwards={shiftInputUpwards} />
          <LetterList myClass="video-letter-alphabet" type="alphabet" letters={alphabet} gap={0.5} opacity={opacityAlphabet} shiftInputUpwards={translateAlphabet} />
          <LetterList myClass="video-letter-alphabet-shifted" type="alphabet-shifted" letters={alphabetShifted} gap={0.5} opacity={opacityAlphabetShifted} shiftInputUpwards={-translateAlphabetShifted} />
          <ShiftAmount opacity={opacityShift} />
        </AbsoluteFill>
      </Sequence>
  )
}

function MidSequence({from, durationInFrames}) {
  const {input, shift, output, alphabet, alphabetShifted, animationIndex, setAnimationIndex, setAlphabet, setAlphabetShifted} = useContext(CaesarContext)
  const frame = useCurrentFrame()
  const [animationStep, setAnimationStep] = useState(1)

  useEffect(() => {
    if (animationIndex > 0 && animationIndex < input.length + 1) {
      input[animationIndex - 1].active = false
      output[animationIndex - 1].active = false
    }
    if (animationIndex < input.length) {
      input[animationIndex].active = true
    }
  }, [animationIndex])

  useEffect(() => {
    if (animationIndex >= output.length) return
    if (animationStep === 1) {
      alphabet.filter((l) => l.active).forEach((l) => l.active = false)
      alphabetShifted.filter((l) => l.active).forEach((l) => l.active = false)
    } else if (animationStep === 2) {
      highlightLetter(input[animationIndex].letter, alphabet, setAlphabet)
    } else if (animationStep === 3) {
      highlightLetter(input[animationIndex].letter, alphabetShifted, setAlphabetShifted, shift)
    } else if (animationStep === 4) {
      output[animationIndex].active = true
    }
  }, [animationStep])

  useEffect(() => {
    if (Math.floor((frame - from) % (30 / 4)) === 0) {
      setAnimationStep(animationStep + 1)
    }
    if (animationStep % 5 === 0) {
      setAnimationIndex(animationIndex + 1)
      setAnimationStep(1)
      setAlphabet((currentAlphabet) => (
        currentAlphabet.map((item) => {
          return {...item, active: false}
        })
      ))
      setAlphabetShifted((currentAlphabet) => (
        currentAlphabet.map((item) => {
          return {...item, active: false}
        })
      ))
    }
  }, [frame])
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{backgroundColor: "#000"}}>
        <LetterList
          myClass="video-letter-input"
          type="input"
          letters={input}
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
          letters={output}
          gap={1}
          opacity={1}
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
  const {input, setAnimationIndex, setAlphabet, setAlphabetShifted} = useContext(CaesarContext)
  const frame = useCurrentFrame()
  useEffect(() => {
    if (frame === 0) {
      setAnimationIndex(0)
      setAlphabet((currentAlphabet) => (
        currentAlphabet.map((item) => {
          return {...item, active: false}
        })
      ))
      setAlphabetShifted((currentAlphabet) => (
        currentAlphabet.map((item) => {
          return {...item, active: false}
        })
      ))
    }
  }, [frame])
  return (
    <>
      <IntroSequence />
      <MidSequence from={60} durationInFrames={input.length * 30}/>
    </>
  )
}

function Caesar() {

  const [alphabet, setAlphabet] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map(
    (letter) => {
      return {
        letter: letter,
        active: false
      }
    }
  ))
  const [alphabetShifted, setAlphabetShifted] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map(
    (letter) => {
      return {
        letter: letter,
        active: false
      }
    }
  ))

  const [shift, setShift] = useState(18)

  const [input, setInput] = useState('th'.split("").map(
    (letter) => {
      return {
        letter: letter,
        active: false
      }
    }
  ))
  const [output, setOutput] = useState([])

  const [animationIndex, setAnimationIndex] = useState(0)

  useEffect(() => {
    setOutput(() => {
      if (input.length <= 0) return ''
      return caesarShift(input).map(
        (letter) => {
          return {
            letter: letter,
            active: false
          }
        }
      )
    })
    shiftAlphabet()
  }, [input, shift])


  function caesarShift(characterList) {
    return characterList.map(
      ({letter}) => {
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
      })

  }
  
  function shiftAlphabet() {
    setAlphabetShifted(alphabetShifted => {
      return alphabetShifted.map((_, index) => {
        return alphabet[(index + shift + 26) % 26]
      })
    })
  }

  function updateInput(inputValue) {
    setInput(
      inputValue.split("").map(letter => {
        return {
          letter: letter,
          active: false,
        }
      })
    )
  }
  function updateOutput(inputValue) {
    setOutput(
      inputValue.split("").map(letter => {
        return {
          letter: letter,
          active: false,
        }
      })
    )
  }

  return (
    <>
      <CaesarContext.Provider value={{input, shift, output, alphabet, alphabetShifted, setAlphabet, setAlphabetShifted, animationIndex, setAnimationIndex}}>
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
          <input onChange={e => updateInput(e.target.value)} type="text" value={input.map((letter) => letter.letter).join("")} id="clear-text-field" />
        </div>

        <div className="video-container">
          <Player
            style={{width: "90%"}}
            component={CaesarVideo}
            durationInFrames={60 + input.length * 30 + 60}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay={true}
            controls
            loop={true}
          />
        </div>
        <div className="output-area">
          <span>Ausgabe:</span>
          <span>{output.map((letter) => letter.letter).join("")}</span>
        </div>
      </CaesarContext.Provider>
    </>
  )
}

export default Caesar