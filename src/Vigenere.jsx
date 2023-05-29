import { useEffect, useState, createContext, useContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'
import { LetterList, Letter, ShiftingLetter } from './LetterList'
import { keyToAlphabet} from './utils'

const VigenereContext = createContext(null)

function MySequence({children, from, durationInFrames}) {
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


function IntroSequence() {
  const {input} = useContext(VigenereContext)
  const frame = useCurrentFrame()
  
  const opacity = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const gap = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'})

  return (
      <MySequence from={0} durationInFrames={2 * 30}>
        <VideoElement 
          top={ () => interpolate(frame, [0, 60], [360, 120], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}) }>
          <LetterList type="input" letters={input} gap={gap} opacity={opacity}/>
        </VideoElement>
      </MySequence>
  )
}


function VigenereVideo() {
  const {input, key} = useContext(VigenereContext)
  const frame = useCurrentFrame()

  const [index, setIndex] = useState(0)

  const top = () => interpolate(frame, [60, 120], [360, 120], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const opacity = interpolate(frame, [60, 120], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const gap = interpolate(frame, [60, 120], [0, 1], {extrapolateRight: 'clamp'})
  return (
    <>
    <IntroSequence />
    <MySequence from={60} durationInFrames={60}>
        <VideoElement 
          top={120}>
          <LetterList type="input" letters={input} gap={1} opacity={1}/>
        </VideoElement>
      <VideoElement top={"50%"} left={"20%"}>
        <Letter myStyle={{fontSize: '7rem'}} letter={input[index]}/>
      </VideoElement>
      <VideoElement top={"50%"} left={"50%"}>
        <div>+{keyToAlphabet(key[index])}</div>
      </VideoElement>
      <VideoElement top={"50%"} right={"20%"}>
        <ShiftingLetter myStyle={{fontSize: '7rem'}} letter={input[index]} shift={keyToAlphabet(key[index])}/>
      </VideoElement>

    </MySequence>
    <MySequence from={120} durationInFrames={60}>
    </MySequence>
    </>
  )
}

function Vigenere() {

  return (
    <>

      <VigenereContext.Provider
        value={{
          input: 'abcde'.split("").map(l => ({letter: l, active: false})),
          key: 'hello'.split("")
        }}
      >

        <div className="video-container">
          <Player
            style={{height: "240px"}}
            component={VigenereVideo}
            durationInFrames={2*60}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            autoPlay={true}
            controls
            loop={true}
          />
        </div>
      </VigenereContext.Provider>
    </>
  )
}

export default Vigenere