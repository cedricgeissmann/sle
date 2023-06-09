import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { hexStringToString, stringToHex, stringToHexArray, subBytes, mixColumns, inverseMixColumns, xor_list, shiftRows, shiftRowsInverse, aes, aes_reverse, expandKey } from './utils.js'
import './AES.css'


function FadeComponent({children, fadeState, setFadeState}) {

  const [fade, setFade] = useState('fade-show')

  useEffect(() => {
    console.log(fadeState)
    if (fadeState === 'fade-toggle') {
      setFade('fade-out')
      setTimeout(() => {setFade('fade-in'); setFadeState('fade-show')}, 500)
    }
  }, [fadeState])

  return (
    <div className={fade}>
      {children}
    </div>
  )
}

/*
 * This Component should just display the state of the hexArray in a grid.
 */
function BlockComponent({b}) {

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
    <div style={blockStyle}>
      {block.map((column, i) => (
        <span style={entryStyle} key={i}>
          {column}
        </span>
      )
      )}
    </div>
  )
}

function KeyComponent({expanded, round}) {
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

  return (
    <div style={blockStyle}>
      {expanded.map((column, i) => (
        <span style={entryStyle} key={i} className={getActive(i)}>
          {column}
        </span>
      )
      )}
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

  const [input, setInput] = useState('secret');
  const [output, setOutput] = useState('');
  const [round, setRound] = useState(0)
  const [expanded, setExpanded] = useState(new Array(176).fill('00'))

  const [key, setKey] = useState('YELLOW SUBMARINE')
  const [b, setB] = useState(null)
  const [k, setK] = useState('')

  const [showBlock, setShowBlock] = useState('fade-show')

  function updateB(newEntry) {
    setShowBlock('fade-toggle')
    setTimeout(() => setB(newEntry), 500)
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


  const shift = () => {
    shiftRows(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const reverseShift = () => {
    shiftRowsInverse(b.getHex())
    updateB((current) => new Block(current.getString()))
  }
  const xor = () => {
    xor_list(b.getHex(), expanded.slice(round * 16, (round+1) * 16))
    updateB((current) => new Block(current.getString()))
  }

  const mix = () => {
    mixColumns(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const reverseMix = () => {
    inverseMixColumns(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const subByte = () => {
    subBytes(b.getHex())
    updateB((current) => new Block(current.getString()))
  }

  const subByteInverse = () => {
    subBytes(b.getHex(), {backward: true})
    updateB((current) => new Block(current.getString()))
  }

  function encrypt() {
    const out = aes(b.getHex(), k.getHex())
    updateB(new Block(hexStringToString(out)))
    setOutput(hexStringToString(out))
  }

  function decrypt() {
    const out = aes_reverse(b.getHex(), k.getHex())
    updateB(new Block(hexStringToString(out)))
    setOutput(hexStringToString(out))
  }

  function expandKey_() {
    expandKey(k.getHex())
  }

  function roundForward() {
    setRound((r) => Math.min(r+1, 10))
    subByte(b.getHex())
    shiftRows(b.getHex())
    mixColumns(b.getHex())
    xor_list(b.getHex(), expanded.slice(round * 16, (round+1) * 16))
  }

  function roundBackward() {

  }

  const buttonGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 40%)',
    width: 'min(400px, 70vw)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '10px auto'
  }


  return (
    <>
      <h2>AES <span>Runde: {round}</span></h2>
      <div>
      <label htmlFor="input">Eingabe: </label>
      <input id="input" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div>
      <label htmlFor="key">Schlüssel: </label>
      <input id="key" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <div className="output">
        Ausgabe: 
        <span>
          <span>{output}</span>
          <span>{b && b.getHex()}</span>
        </span>
      </div>
      <div style={buttonGrid}>
        <button onClick={() => expandKey_()}>Expand Key</button>
        <button onClick={() => xor()}>XOR</button>
      </div>
      <div style={buttonGrid}>
        <button onClick={() => subByte()}>SubByte</button>
        <button onClick={() => subByteInverse()}>SubByte Inverse</button>
        <button onClick={() => shift()}>Shift</button>
        <button onClick={() => reverseShift()}>Shift Reverse</button>
        <button onClick={() => mix()}>Mix Columns</button>
        <button onClick={() => reverseMix()}>Reverse</button>
        <button onClick={() => roundForward()}>Runde</button>
        <button onClick={() => roundBackward()}>Runde Rückwärts</button>
        <button onClick={() => setRound(r => Math.min(r+1, 10))}>Next Round</button>
        <button onClick={() => setRound(r => Math.max(r-1, 0))}>Previous Round</button>
      </div>
      <div style={buttonGrid}>
        <button onClick={() => encrypt()}>Full Encryption</button>
        <button onClick={() => decrypt()}>Full Decryption</button>
      </div>

      <FadeComponent fadeState={showBlock} setFadeState={setShowBlock}>
      <ErrorBoundary fallback={<div>Upps...</div>}>
        <BlockComponent b={b} />
      </ErrorBoundary>
      </FadeComponent>
      <ErrorBoundary fallback={<div>Key error...</div>}>
        <KeyComponent expanded={expanded} round={round} />
      </ErrorBoundary>
    </>
  )
}

export default AES