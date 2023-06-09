import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { hexStringToString, stringToHex, stringToHexArray, subBytes } from './utils.js'

/*
 * This Component should just display the state of the hexArray in a grid.
 */
function BlockComponent({b}) {

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
      {b && b.hexArray.map((column, i) => (
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

  const show = () => {
    console.log(b.block)
  }
  const shift = () => {
    b.shiftRows()
    console.log(b.block)
  }
  const xor = () => {
    b.xor(k)
    console.log(b)
  }

  const mix = () => {
    b.mixColumns()
  }

  const reverseMix = () => {
    b.inverseMixColumns()
  }

  const subByte = () => {
    subBytes(b.hexArray)
    setB((current) => new Block(hexStringToString(current.hexArray)))
  }

  const subByteInverse = () => {
    subBytes(b.hexArray, {backward: true})
    setB((current) => new Block(hexStringToString(current.hexArray)))
  }




  function round() {
    console.log("Schlüssel erweitern")
    const newKey = expandKey(key)
    console.log("newKey:", newKey)

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
        <button onClick={() => mix()}>Mix Columns</button>
        <button onClick={() => reverseMix()}>Reverse</button>
        <button onClick={() => xor()}>XOR</button>
        <button onClick={() => subByte()}>SubByte</button>
        <button onClick={() => subByteInverse()}>SubByte Inverse</button>
        <button onClick={() => expandKey(key)}>Expand Key</button>
      </div>
      <div>
        <button onClick={() => round()}>Round</button>
      </div>

      <ErrorBoundary fallback={<div>Upps...</div>}>
      <BlockComponent b={b} />
      </ErrorBoundary>
    </>
  )
}

export default AES