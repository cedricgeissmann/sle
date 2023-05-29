import { useEffect, useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'
import { LetterList, Letter, ShiftingLetter } from './LetterList'
import { keyToAlphabet, shiftChar} from './utils'

const VigenereContext = createContext(null)

function MySequence({children, from, durationInFrames}) {

  useEffect(() => {
    console.log(from, durationInFrames)
  }, [])
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {children}
      </AbsoluteFill>
    </Sequence>
  )
}

function VideoElement({children, top, left, right, bottom}) {
  return (
      <div style={{
        position: 'absolute',
        color: 'white',
        top: typeof top === 'function' ? top() : top,
        left: typeof left === 'function' ? left() : left,
        right: typeof right === 'function' ? right() : right,
        bottom: typeof bottom === 'function' ? bottom() : bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children}
      </div>
  )
}

function VideoTransform({from, to}) {
  const frame = useCurrentFrame()
  const {durationInFrames} = useVideoConfig()
  const opacityFrom = interpolate(frame, [0, durationInFrames], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const opacityTo = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'})

  return (
    <>
      <div style={{position: 'relative', fontSize: '7rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'absolute', opacity: opacityFrom}}>{from}</div>
        <div style={{position: 'absolute', opacity: opacityTo}}>{to}</div>
      </div>
    </>
  )
}


function IntroSequence() {
  const {input, key} = useContext(VigenereContext)
  const frame = useCurrentFrame()
  
  const opacity = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const gap = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'})

  return (
      <MySequence from={0} durationInFrames={2 * 30}>
        <VideoElement 
          top={ () => interpolate(frame, [0, 60], [360, 120], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}) }
          left={() => interpolate(frame, [0, 60], [640, 200], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})}>
          <LetterList type="input" letters={input} gap={gap} opacity={opacity}/>
        </VideoElement>

        <VideoElement 
          top={ () => interpolate(frame, [0, 60], [360, 120], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}) }
          left={() => interpolate(frame, [0, 60], [640, 1080], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})}>
          <LetterList type="input" letters={key} gap={gap} opacity={opacity}/>
        </VideoElement>
      </MySequence>
  )
}


function VigenereVideo() {
  const {input, output, setOutput, key} = useContext(VigenereContext)
  const frame = useCurrentFrame()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (frame % 60 === 0) setIndex((index) => index + 1)
    if (frame === 0) setIndex(0)
  }, [frame])

  useEffect(() => {
    setOutput((current) => {
      return current.map((l, i) => {
        if (i < index) return {...l, active: true}
        return {...l, active: false}
      })
    })
  }, [index])

  return (
    <>
      <IntroSequence />
      {input.map((l, i) => (
        <MySequence key={`sequence-${i}`} from={60 + i * 60} durationInFrames={60}>
          <VideoElement top={120} left="200px">
            <LetterList type="input" letters={input} gap={1} opacity={1} />
          </VideoElement>
          <VideoElement top={120} left="1080px">
            <LetterList type="input" letters={key} gap={1} opacity={1} />
          </VideoElement>
          <VideoElement top={"50%"} left={"20%"}>
            <Letter myStyle={{fontSize: "7rem", position: 'absolute'}} letter={l} />
          </VideoElement>
          <VideoElement top={"50%"} left={"50%"}>
            <div style={{fontSize: "4rem", display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
              <span>{key[i % key.length].letter}: </span>
              <span>+{keyToAlphabet(key[i % key.length].letter)}</span>
            </div>
          </VideoElement>
          <VideoElement top={"50%"} right={"20%"}>
            <VideoTransform from={l.letter} to={shiftChar(l.letter, keyToAlphabet(key[i % key.length].letter))} />
          </VideoElement>
          <VideoElement bottom={"10%"}>
            <LetterList type="output" letters={output} gap={1} opacity={0} />
          </VideoElement>
        </MySequence>
      ))}
    </>
  )
}

function Vigenere() {

  const [input, setInput] = useState('abcde'.split("").map(l => ({letter: l, active: false})))
  const [key, setKey] = useState('key'.split("").map(l => ({letter: l, active: false})))
  const [output, setOutput] = useState([])

  useEffect(() => {
    shiftVigenere()
  }, [input, key])

  function updateInput(inputValue) {
    setInput(
      inputValue
        .split("")
        .filter(letter => letter.toLowerCase() >= "a" && letter.toLowerCase() <= "z")
        .map(letter => ({
          letter: letter,
          active: false,
        }))
    )
  }

  function updateKey(keyValue) {
    setKey(
      keyValue
        .split("")
        .filter(letter => letter.toLowerCase() >= "a" && letter.toLowerCase() <= "z")
        .map(letter => ({
          letter: letter,
          active: false,
        }))
    )
  }

  function shiftVigenere() {
    setOutput(input.map((l, i) => ({
      letter: shiftChar(l.letter, keyToAlphabet(key[i % key.length].letter)),
      active: false
    })))
  }

  return (
    <>
      <VigenereContext.Provider value={{input, setInput, key, output, setOutput}}>
        <div className="box">
          <div className="inline-container">
            Vigenère mit Schlüssel:
            <input
              className="text-input"
              type="text"
              onChange={e => updateKey(e.target.value)}
              value={key.map(l => l.letter).join("")}
            />
          </div>
          <div className="input-area inline-container">
            <label htmlFor="clear-text-field">Eingabe:</label>
            <input
              className="text-input"
              onChange={e => updateInput(e.target.value)}
              type="text"
              value={input.map(letter => letter.letter).join("")}
              id="clear-text-field"
            />
          </div>
        </div>

        <div className="video-container">
          <Player
            style={{height: "240px"}}
            component={VigenereVideo}
            durationInFrames={60 + (input.length - input.filter(l => l.letter < 'a' || l.letter > 'z').length) * 60}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay={true}
            controls
            loop={true}
          />
        </div>
        <div className="box">
          <div className="output-area">
            <span>Ausgabe:</span>
            <span>{output.map(letter => letter.letter).join("")}</span>
          </div>
        </div>
      </VigenereContext.Provider>
    </>
  )
}

export default Vigenere