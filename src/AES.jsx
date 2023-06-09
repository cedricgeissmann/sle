import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { hexStringToString, stringToHex, stringToHexArray, subBytes, mixColumns, inverseMixColumns, xor_list, shiftRows, shiftRowsInverse, aes, aes_reverse, expandKey } from './utils.js'

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

function KeyComponent({k}) {
  const [expanded, setExpanded] = useState(new Array(176).fill('00'))
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
    k && setExpanded(expandKey(k.getHex()))
  }, [k])

  return (
    <div style={blockStyle}>
      {expanded.map((column, i) => (
        <span style={entryStyle} key={i}>
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

  const [key, setKey] = useState('YELLOW SUBMARINE')
  const [b, setB] = useState(null)
  const [k, setK] = useState('')

  useEffect(() => {
    setOutput(stringToHex(input));
  }, [input])

  useEffect(() => {
    setB(new Block(input));
  }, [output])

  useEffect(() => {
    setK(new Block(key));
  }, [key])

  const shift = () => {
    shiftRows(b.getHex())
    setB((current) => new Block(current.getString()))
  }

  const reverseShift = () => {
    shiftRowsInverse(b.getHex())
    setB((current) => new Block(current.getString()))
  }
  const xor = () => {
    xor_list(b.getHex(), k.getHex())
    setB((current) => new Block(current.getString()))
  }

  const mix = () => {
    mixColumns(b.getHex())
    setB((current) => new Block(current.getString()))
  }

  const reverseMix = () => {
    inverseMixColumns(b.getHex())
    setB((current) => new Block(current.getString()))
  }

  const subByte = () => {
    subBytes(b.getHex())
    setB((current) => new Block(current.getString()))
  }

  const subByteInverse = () => {
    subBytes(b.getHex(), {backward: true})
    setB((current) => new Block(current.getString()))
  }

  function round() {
    const out = aes(b.getHex(), k.getHex())
    setB((current) => new Block(hexStringToString(out)))
  }

  function roundReverse() {
    const out = aes_reverse(b.getHex(), k.getHex())
    setB((current) => new Block(hexStringToString(out)))
  }

  function expandKey_() {
    expandKey(k.getHex())
  }


  return (
    <>
      <h2>AES</h2>
      <ul>
        <li>Schlüssel erweitern</li>
        <li>Schlüssel verrechnen</li>
        <li>Zeilen verschieben</li>
      </ul>
      <div>
      <label htmlFor="input">Eingabe: </label>
      <input id="input" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div>
      <label htmlFor="key">Schlüssel: </label>
      <input id="key" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <div>
        Ausgabe: <span>{output}</span>
      </div>
      <div>
        <button onClick={() => shift()}>Shift</button>
        <button onClick={() => reverseShift()}>Shift Reverse</button>
        <button onClick={() => mix()}>Mix Columns</button>
        <button onClick={() => reverseMix()}>Reverse</button>
        <button onClick={() => xor()}>XOR</button>
        <button onClick={() => subByte()}>SubByte</button>
        <button onClick={() => subByteInverse()}>SubByte Inverse</button>
        <button onClick={() => expandKey_()}>Expand Key</button>
      </div>
      <div>
        <button onClick={() => round()}>Round</button>
        <button onClick={() => roundReverse()}>Round Reverse</button>
      </div>

      <ErrorBoundary fallback={<div>Upps...</div>}>
        <BlockComponent b={b} />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Key error...</div>}>
        <KeyComponent k={k} />
      </ErrorBoundary>
    </>
  )
}

export default AES