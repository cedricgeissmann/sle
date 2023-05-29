import { useEffect, useState, createContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'
import { LetterList, Letter } from './LetterList'

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
      }}>
        {children}
      </div>
  )
}

function VigenereVideo() {
  const frame = useCurrentFrame()
  const top = () => interpolate(frame, [0, 60], [360, 120], {extrapolateRight: 'clamp'})
  const opacity = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'})
  const gap = interpolate(frame, [0, 60], [0, 1], {extrapolateRight: 'clamp'})
  return (
    <>
    <MySequence from={0} durationInFrames={60}>
      <VideoElement top={top}>
        <LetterList 
          letters={'abcd'.split("").map(l => (
          {letter: l, active: false}
          ))
          } 
          opacity={opacity}
          gap={gap}
          letterStyle={{fontSize: '7rem'}} />
      </VideoElement>
    </MySequence>
    <MySequence from={60} durationInFrames={60}>
      <VideoElement top={"50%"} left={"20%"}>
        <Letter myStyle={{fontSize: '7rem'}} letter={{letter: 'e', active: true}}/>
      </VideoElement>
    </MySequence>
    </>
  )
}

function Vigenere() {

  return (
    <>

      <VigenereContext.Provider
        value={{
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