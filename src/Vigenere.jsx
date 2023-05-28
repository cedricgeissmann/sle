import { useEffect, useState, createContext } from 'react'
import { Player } from '@remotion/player'
import './Vigenere.css'
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, useVideoConfig, getInputProps } from 'remotion'

const VigenereContext = createContext(null)

function MySequence({children}) {
  return (
    <Sequence from={0} durationInFrames={60}>
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

function VideoElement({children, top, left, right}) {
  return (
      <div style={{
        position: 'absolute',
        top: typeof top === 'function' ? top() : top,
        left: typeof left === 'function' ? left() : left,
        right: typeof right === 'function' ? right() : right,
      }}>
        {children}
      </div>
  )
}

function VigenereVideo() {
  const frame = useCurrentFrame()
  const top = () => interpolate(frame, [0, 60], [0, 1080], {extrapolateRight: 'clamp'})
  const right = () => interpolate(frame, [0, 60], [0, 1920], {extrapolateRight: 'clamp'})
  return (
    <MySequence>
      <VideoElement top={50} right={right}>
        <h1>Vigenere</h1>
      </VideoElement>
    </MySequence>
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
            durationInFrames={60}
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