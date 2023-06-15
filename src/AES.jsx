import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { hexStringToString, stringToHex, stringToHexArray, subBytes, mixColumns, inverseMixColumns, xor_list, shiftRows, shiftRowsInverse, aes, aes_reverse, expandKey } from './utils.js'
import './AES.css'
import useDelayUpdate from './useDelayUpdate.js'
import AnimationState from './components/AnimationState.jsx'
import { calcVideoDuration, VideoChapterContainer, VideoChapterLink } from './Video.jsx'
import AESVideo from './AESVideo.jsx'
import { createContext } from 'react'
import { useRef } from 'react'
import { Player } from '@remotion/player'
import Hint from './Hint.jsx'

export const AESContext = createContext(null)

/*
 * This Component should just display the state of the hexArray in a grid.
 */
export function BlockComponent({b}) {

  const [block, setBlock] = useState([])

  useEffect(() => {
    if (b === null) return
    const newBlock = new Array(16).fill('00')
    const lookup = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15]
    b.getHex().forEach((e, i) => newBlock[lookup[i]] = e)
    setBlock(newBlock)
  }, [b])

  const blockStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '.5rem'
  }

  const entryStyle = {
    height: '50px',
    width: '50px',
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Speicherblock</h2>
    <div style={blockStyle}>
      {block.map((column, i) => (
        <span style={entryStyle} key={i}>
          {column}
        </span>
      )
      )}
      </div>
    </div>
  )
}

export function KeyComponent({expanded, round}) {
  const blockStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(16, auto)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '.1rem'
  }
  const entryStyle = {
    height: '2rem',
    width: '2rem',
    border: '1px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  useEffect(() => {
    // just to rerender to component
  }, [round])

  function getActive(i) {
    if (round * 16 <= i && i < (round + 1) * 16 ) return 'active-key'
    return ''
  }

  function getShow(i) {
    if (i < (round + 1) * 16) return 'show-key'
    return 'hide-key'
  }

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Erweiterter Schlüssel</h2>
    <div style={blockStyle}>
      {expanded.map((column, i) => (
        <span style={entryStyle} key={i} className={getActive(i) + " " + getShow(i)}>
          {column}
        </span>
      )
      )}
    </div>
    </div>
  )

}

/* 
 * Take an input and convert it to a 4x4 block.
 * Fill up the block if needed, or cut of the block if it is to long.
 */
export class Block {
  constructor(inputString) {
    this.hexArray = stringToHexArray(inputString.substring(0, 16))
    // Array of the incomming data encoded in hey string
    for (let i = this.hexArray.length; i < 16; i++) {
      this.hexArray.push('00')
    }
  }

  getHex() {
    return this.hexArray
  }

  getString() {
    return hexStringToString(this.hexArray)
  }
}

function AES() {
  const [videoInformation, setVideoInformation] = useState({
    'key-expansion': {show: true, duration: 60, start: 0, name: "Schlüssel erweitern"},
    'transition-key-expansion': {show: true, duration: 30, start: 0, name: ""},
    'block-creation': {show: true, duration: 60, start: 0, name: "Block erstellen"},
    'add-initial-key': {show: true, duration: 60, start: 60, name: "Verschlüsseln"},
    'sub-bytes': {show: true, duration: 60, start: 60, name: "Bytes austauschen"},
    'shift-rows': {show: true, duration: 60, start: 60, name: "Zeilen verschieben"},
    'mix-columns': {show: true, duration: 60, start: 60, name: "Spalten mischen"},
    'add-round-key': {show: true, duration: 60, start: 60, name: "Rundenschlüssel"},
  })
  const [playbackRate, setPlaybackRate] = useState(1)
  const playerRef = useRef(null)

  const [input, setInput] = useState('secret');
  const [output, setOutput] = useState('');
  const [round, setRound] = useState(0)
  const [expanded, setExpanded] = useState(new Array(176).fill('00'))

  const [key, setKey] = useState('YELLOW SUBMARINE')
  const [b, setB] = useState(null)
  const [k, setK] = useState('')

  const [animTrigger, setFadeTrigger] = useState('fade-show')

  function updateB(newEntry) {
    setFadeTrigger(() => new String('fadeout shrink'))
    setB(newEntry)
  }

  useEffect(() => {
    b && setOutput(hexStringToString(b.getHex()));
  }, [b])

  useEffect(() => {
    updateB(new Block(input))
  }, [input])

  useEffect(() => {
    setK(new Block(key));
  }, [key])

  useEffect(() => {
    k && setExpanded(expandKey(k.getHex()))
  }, [k])


  const shift_ = () => {
    shiftRows(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const reverseShift_ = () => {
    shiftRowsInverse(b.getHex())
    updateB((current) => new Block(current.getString()))
  }
  const xor_ = () => {
    xor_list(b.getHex(), expanded.slice((round - 1) * 16, round * 16))
    updateB((current) => new Block(current.getString()))
  }

  const mix_ = () => {
    mixColumns(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const reverseMix_ = () => {
    inverseMixColumns(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const subByte_ = () => {
    subBytes(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const subByteInverse_ = () => {
    subBytes(b.getHex(), {backward: true})
    updateB((current) => new Block(current.getString()))
  }

  function encrypt() {
    const out = aes(b.getHex(), k.getHex())
    updateB(new Block(hexStringToString(out)))
    setOutput(hexStringToString(out))
    setRound(10)
  }

  function decrypt() {
    const out = aes_reverse(b.getHex(), k.getHex())
    updateB(new Block(hexStringToString(out)))
    setOutput(hexStringToString(out))
    setRound(1)
  }

  function expandKey_() {
    expandKey(k.getHex())
  }

  function roundForward() {
    setRound((r) => {
      if (r >= 10) return r
      const round = Math.min(r+1, 10)
      subBytes(b.getHex())
      shiftRows(b.getHex())
      mixColumns(b.getHex())
      xor_list(b.getHex(), expanded.slice((round - 1) * 16, round * 16))
      updateB((current) => new Block(current.getString()))
      return round
    })
  }

  function roundBackward() {
    setRound((r) => {
      if (r <= 1) return r
      xor_list(b.getHex(), expanded.slice((r - 1) * 16, r * 16))
      inverseMixColumns(b.getHex())
      shiftRowsInverse(b.getHex())
      subBytes(b.getHex(), {backward: true})
      updateB((current) => new Block(current.getString()))
      return Math.max(r-1, 1)
    })
  }

  const buttonGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, auto)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '10px auto'
  }


  return (
    <>
      <AESContext.Provider value={{videoInformation, setVideoInformation, expanded, setExpanded, round, setRound, b, setB}}>
        <h2>
          AES <span>Runde: {round}</span>
        </h2>
        <p>
        Hier wird eine Runde von AES durchgeführt. Zuerst wird der Schlüssel erweitert und dann läuft eine einzige Runde von AES durch.
        </p>
<p>
  <b>Aufgabe:</b> Schaffen Sie es die Verschlüsselung rückgängig zu machen?
</p>
<Hint title='Frage' hintText='Schaffen Sie es jeden Schritt im Video direkt umzukehren?'></Hint>
        <div className='box'>
          <div>
          <label htmlFor="input">Eingabe: </label>
          <input id="input" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <label htmlFor="key">Schlüssel: </label>
          <input id="key" value={key} onChange={e => setKey(e.target.value)} />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
          gap: '0.5rem'
        }}>
          <div style={{
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '2rem',
            alignItems: 'center'
          }}>
          <span>Ausgabe (Text):</span><span style={{
            fontFamily: 'monospace',
            fontSize: '1.6rem'
          }}>{output}</span>
          </div>
          <div style={{            
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '2rem',
            alignItems: 'center'
          }}>
          <span>Ausgabe (Hex):</span><span style={{
            fontFamily: 'monospace',
            fontSize: '1.6rem'
          }}>{b && b.getHex()}</span>
          </div>
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
              component={AESVideo}
              durationInFrames={calcVideoDuration(videoInformation)}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              autoPlay={false}
              controls
              loop={true}
              playbackRate={playbackRate}
              showPlaybackRateControl={true}
            />
          }
        ></VideoChapterContainer>

        <div style={buttonGrid}>
          <button onClick={() => expandKey_()}>Expand Key</button>
          <button onClick={() => subByte_()}>Bytes ersetzen</button>
          <button onClick={() => shift_()}>Zeilen verschieben</button>
          <button onClick={() => mix_()}>Spalten mischen</button>
          <button onClick={() => roundForward()}>Runde weiter</button>
          <button onClick={() => setRound(r => Math.min(r + 1, 10))}>+1</button>
          <button onClick={() => decrypt()}>Volle Verschlüsselung</button>
          {/* --- */}
          <button onClick={() => xor_()}>XOR</button>
          <button onClick={() => subByteInverse_()}>Rückwärts ersetzen</button>
          <button onClick={() => reverseShift_()}>Zurück verschieben</button>
          <button onClick={() => reverseMix_()}>Mischen umkehren</button>
          <button onClick={() => roundBackward()}>Runde zurück</button>
          <button onClick={() => setRound(r => Math.max(r - 1, 0))}>-1</button>
          <button onClick={() => encrypt()}>Volle Entschlüsselung</button>
        </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}>

        <ErrorBoundary fallback={<div>Key error...</div>}>
          <KeyComponent expanded={expanded} round={round} />
        </ErrorBoundary>
        <AnimationState timeout={500} trigger={animTrigger}>
          <ErrorBoundary fallback={<div>Upps...</div>}>
            <BlockComponent b={b} />
          </ErrorBoundary>
        </AnimationState>
          </div>
      </AESContext.Provider>
    </>
  )
}

export default AES