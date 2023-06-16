import { useEffect, useState, createContext, useContext, useRef } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import Hint from './Hint'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'
import { LetterList, Letter, ShiftingLetter } from './LetterList'
import { keyToAlphabet, shiftChar} from './utils'
import { VideoElement, VideoTransform, MySequence, VideoChapterContainer, calcVideoDuration, VideoChapterLink } from './Video'

const VigenereContext = createContext(null)

function IntroSequence() {
  const PART = "intro"
  const {input, key, videoInformation} = useContext(VigenereContext)
  const frame = useCurrentFrame()
  
  const opacity = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const gap = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'})

  return (
      <MySequence from={videoInformation[PART].start} durationInFrames={videoInformation[PART].duration}>
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

function MidSequence() {
  const PART = "mid"
  const {input, output, setOutput, key, videoInformation} = useContext(VigenereContext)
  const frame = useCurrentFrame()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (frame % 60 === 0) setIndex(index => index + 1)
    if (frame === 0) setIndex(0)
  }, [frame])

  useEffect(() => {
    setOutput(current => {
      return current.map((l, i) => {
        if (i < index) return {...l, active: true}
        return {...l, active: false}
      })
    })
  }, [index])

  return (
    <>
      {input.map((l, i) => (
        <MySequence key={`sequence-${i}`} from={videoInformation[PART].start + i * 60} durationInFrames={60}>
          <VideoElement top={120} left="200px">
            <LetterList type="input" letters={input} gap={1} opacity={1} />
          </VideoElement>
          <VideoElement top={120} left="1080px">
            <LetterList type="input" letters={key} gap={1} opacity={1} />
          </VideoElement>
          <VideoElement top={"50%"} left={"20%"}>
            <Letter myStyle={{fontSize: "7rem", position: "absolute"}} letter={l} />
          </VideoElement>
          <VideoElement top={"50%"} left={"50%"}>
            <div
              style={{
                fontSize: "4rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
              }}
            >
              <span>{key[i % key.length].letter}: </span>
              <span>+{keyToAlphabet(key[i % key.length].letter)}</span>
            </div>
          </VideoElement>
          <VideoElement top={"50%"} right={"20%"}>
            <VideoTransform
              from={l.letter}
              to={shiftChar(l.letter, keyToAlphabet(key[i % key.length].letter))}
              style_={{fontSize: "7em"}}
            />
          </VideoElement>
          <VideoElement bottom={"10%"}>
            <LetterList type="output" letters={output} gap={1} opacity={0} />
          </VideoElement>
        </MySequence>
      ))}
    </>
  )
}



function VigenereVideo() {
  const {input, output, setOutput, key, videoInformation} = useContext(VigenereContext)
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
    {videoInformation["intro"].show && <IntroSequence />}
    {videoInformation["mid"].show && <MidSequence />}
    </>
  )
}

function Vigenere() {
  const playerRef = useRef(null)
  const [videoInformation, setVideoInformation] = useState({
    intro: {show: true, duration: 60, start: 0, name: 'Intro'},
    mid: {show: true, duration: (len) => len, start: 0, name: 'Verschlüsselung'},
  })
  const [playbackRate, setPlaybackRate] = useState(1)

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
      <VigenereContext.Provider
        value={{
          input,
          setInput,
          key,
          output,
          setOutput,
          videoInformation,
        }}
      >
        <p>
          Hier finden Sie das Vigenère-Verfahren, welches mit dem Schlüssel <b>{key.map(l => l.letter).join("")}</b> die
          Nachricht <b>{input.map(l => l.letter).join("")}</b> verschlüsselt.
        </p>
        <Hint hintFile="vigenere" />
        <div className="box">
          <div className="inline-container">
            Schlüssel:
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

        <VideoChapterContainer
          playbackRate={playbackRate}
          setPlaybackRate={setPlaybackRate}
          chapters={
            <>
              {Object.entries(videoInformation).map(([key, val]) => (
                <VideoChapterLink
                  key={key}
                  info={videoInformation}
                  setInfo={setVideoInformation}
                  playerRef={playerRef}
                  part={key}
                >
                  {val.name}
                </VideoChapterLink>
              ))}
            </>
          }
          video={
            <Player
              ref={playerRef}
              style={{width: "640px"}}
              component={VigenereVideo}
              durationInFrames={calcVideoDuration(
                videoInformation,
                (input.length - input.filter(l => l.letter < "a" || l.letter > "z").length) * 60
              )}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              autoPlay={true}
              controls
              loop={true}
            />
          }
        ></VideoChapterContainer>
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