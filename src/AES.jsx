import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { decToHex, splitHLBytes, stringToHex, sBox, sBoxInv, RCON, toIndex, xor, shiftIndex, mixColumns, inverseMixColumns, inverseMixColumns_ } from './utils.js'

function BlockComponent({b}) {

  const columnStyle = {
    display: 'inline-block',
    minHeight: '50px',
    minWidth: '50px',
  }

  const blockEntry = {
    minHeight: '50px',
    minWidth: '50px',
    display: 'inline-block',
  }

  return (
    <div>
      {b.block && b.block.map((column, i) => <span style={columnStyle} key={i}>
        {column.map((entry, j) => <span style={blockEntry} key={j}>{entry}</span>)}
        </span>
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
    this.decArray = this.hexString.split(" ").map(char => parseInt(char, 16))
    for (let i = this.decArray.length; i < 16; i++) {
      this.decArray.push(0)
    }
    // Array of the incomming data encoded in hey string
    this.hexArray = this.hexString.split(" ")
    for (let i = this.hexArray.length; i < 16; i++) {
      this.hexArray.push('00')
    }


    this.createBlock()
    this.fillBlock()
    
    this.xtime = new Array(256)
    for (let i = 0; i < 128; i++) {
      this.xtime[i] = i << 1
      this.xtime[128 + i] = (i << 1) ^ 0x1b
    }
  }

  getColumn(col) {
    const column = [
      this.hexArray[toIndex(col, 0)],
      this.hexArray[toIndex(col, 1)],
      this.hexArray[toIndex(col, 2)],
      this.hexArray[toIndex(col, 3)],
    ]
    return column
  }

  setColumn(col, newCol) {
    for (let i = 0; i < newCol.length; i++) {
      this.hexArray[toIndex(col, i)] = newCol[i]
    }
  }

  toBlock() {
    const block = []
    for (let i = 0; i < 4; i++) {
      block.push(new Array(4).fill(0))
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        block[j][i] = this.hexArray[i * 4 + j]
      }
    }
    return block
  }

  printBlock() {
    const block = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        block.push(this.hexArray[toIndex(i, j)])
      }
    }
    return block
  }

  createBlock() {
    this.block = []
    for (let i = 0; i < 4; i++) {
      this.block.push(new Array(4).fill(0))
    }
  }

  fillBlock() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.block[j][i] = this.hexArray[i * 4 + j]
      }
    }
  }

  shiftRows() {
    const copy = [...this.hexArray]
    for (let i = 0; i < this.hexArray.length; i++) {
      const targetIndex = shiftIndex(i)
      this.hexArray[i] = copy[targetIndex]
    }
  }

  gmul(a, b) {
    if (b === 1) {
      return a
    }
    const tmp = (a << 1) & 0xff
    if (b === 2) {
      if (a < 0x80) {
        return tmp
      } else {
        return tmp ^ 0x1b
      }
    }
    if (b === 3) {
      if (a < 0x80) {
        return tmp ^ a
      } else {
        return tmp ^ 0x1b ^ a
      }
    }
  }

  mixColumns() {
    console.log(this.hexArray)
    const res = mixColumns(this.hexArray)
    //const res2 = inverseMixColumns(res)
    // for (let i=0; i < 4; i++) {
    //   const column = this.getColumn(i)
    //   const mix = mixColumns(column)
    //   this.setColumn(i, mix)
    // }
  }

  inverseMixColumns() {
    console.log(this.hexArray)
    inverseMixColumns(this.hexArray)
    // for (let i=0; i < 4; i++) {
    //   const column = this.getColumn(i)
    //   const mix = inverseMixColumns(column)
    //   this.setColumn(i, mix)
    // }
  }

  xor(otherBlock) {
    for (let i = 0; i < this.hexArray.length; i++) {
      this.hexArray[i] = xor(this.hexArray[i], otherBlock.hexArray[i])
    }
  }

  subBytes(options = {backward: false}) {
    const lookup = options.backward ? sBoxInv : sBox
    for (let i = 0; i < this.hexArray.length; i++) {
      const [h, l] = splitHLBytes(this.hexArray[i])
      this.hexArray[i] = decToHex(lookup[h][l])
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