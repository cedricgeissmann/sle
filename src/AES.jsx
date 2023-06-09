import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { stringToHex } from './utils.js'

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
    this.hexString = stringToHex(inputString.substring(0, 16))
    // Array of the incomming data encoded in hey string
    this.hexArray = this.hexString.split(" ")
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
    b.subBytesForward()
  }

  const subByteInverse = () => {
    b.subBytesBackward()
  }



  const expandKey_ = key_ => {
    console.log("key:", key_)
    let utf8Encode = new TextEncoder();
    key_ = utf8Encode.encode(key_);
    let ks = 15 << 5
    let key = new Uint8Array(ks)
    for (let i = 0; i < key.length; i++) {
      key[i] = key_[i]
    }
    console.log("key:", key)

    let kl = key.length
    let Rcon = 1
    let keyA = key.slice()
    let temp = new Array(4).fill(0)

    for (let i = kl; i < ks; i += 4) {
      temp = keyA.slice(i - 4, i)
      console.log('temp:', temp)
      if (i % kl == 0) {
        temp = [Sbox(temp[1]) ^ Rcon, Sbox(temp[2]), Sbox(temp[3]), Sbox(temp[0])]
        if ((Rcon <<= 1) >= 256) {
          Rcon ^= 0x11b
        }
      } else if (kl > 24 && i % kl == 16) {
        temp = [Sbox(temp[0]), Sbox(temp[1]), Sbox(temp[2]), Sbox(temp[3])]
      }
      console.log('temp after: ',temp)
      for (let j = 0; j < 4; j++) {
        keyA[i + j] = keyA[i + j - kl] ^ temp[j]
      }
    }
    console.log("keyA:", keyA)

    return keyA
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
        <button onClick={() => show()}>Show Block</button>
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