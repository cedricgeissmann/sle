import React, { useState, useEffect } from 'react'

class Block {
  constructor(hexString) {
    this.hexString = hexString
    this.hexArray = hexString.split(' ').map(char => parseInt(char, 16))
    for (let i = this.hexArray.length; i < 16; i++) {
      this.hexArray.push(0)
    }
    this.createBlock()
    this.fillBlock()
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
    for (let i = 1; i < 4; i++) {
      const row = this.block[i]
      const temp = row[0]
      for (let j = 0; j < 4; j++) {
        row[j] = row[(j + i) % 4]
      }
      row[4-i] = temp
      
    }
  }

  gmul(a, b) {
    if (b === 1) {
      return a
    }
    const tmp = (a << 1) & 0xFF
    if (b === 2 ) {
      if (tmp < 0xFF) {
        return tmp
      } else {
        return tmp ^ 0x1B
      }
    }
    if (b === 3) {
      if (tmp < 0xFF) {
        return tmp ^ a
      } else {
        return (tmp ^ 0x1B) ^ a
      }
    }
  }

  mixColumns() {

    // db 13 53 45 => 8e 4d a1 bc
    const column = [0xdb, 0x13, 0x53, 0x45]
    //for (let i = 0; i < 4; i++) {
      //const column = this.block[0]
      const c0 = this.gmul(column[0], 2) ^ this.gmul(column[1], 3) ^ this.gmul(column[2], 1) ^ this.gmul(column[3], 1)
      const c1 = this.gmul(column[0], 3) ^ this.gmul(column[1], 2) ^ this.gmul(column[2], 1) ^ this.gmul(column[3], 1)
      const c2 = this.gmul(column[0], 1) ^ this.gmul(column[1], 3) ^ this.gmul(column[2], 2) ^ this.gmul(column[3], 1)
      const c3 = this.gmul(column[0], 1) ^ this.gmul(column[1], 1) ^ this.gmul(column[2], 3) ^ this.gmul(column[3], 2)
    //}
     const res = [c0, c1, c2, c3].map(char => decToHex(char)).join(' ')
     console.log(res)
  }



  xor(otherBlock) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        console.log(this.block[i][j], otherBlock.block[i][j], this.block[i][j] ^ otherBlock.block[i][j])
        this.block[i][j] = this.block[i][j] ^ otherBlock.block[i][j]
      }
    }
  }
}

function decToHex(dec) {
  return dec.toString(16).toUpperCase()
}

function stringToHex(str) {
  return str.split("").map(char => {
    return char.charCodeAt(0).toString(16)
  }).join(" ")
}

function AES() {

  const [input, setInput] = useState('secret');
  const [output, setOutput] = useState('');

  const [key, setKey] = useState('YELLOW SUBMARINE')
  const [b, setB] = useState('')
  const [k, setK] = useState('')

  useEffect(() => {
    setOutput(stringToHex(input));
  }, [input])

  useEffect(() => {
    setB(new Block(output));
  }, [output])

  useEffect(() => {
    setK(new Block(stringToHex(key)));
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



  return (
    <>
      <h2>AES</h2>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <span>{output}</span>
      <div>
        <button onClick={() => show()}>Show Block</button>
        <button onClick={() => shift()}>Shift</button>
        <button onClick={() => mix()}>Mix Columns</button>
        <button onClick={() => xor()}>XOR</button>
      </div>
    </>
  )
}

export default AES