import React, { useState, useEffect } from 'react'

class Block {
  constructor(hexString) {
    this.hexString = hexString
    this.hexArray = hexString.split(" ").map(char => parseInt(char, 16))
    for (let i = this.hexArray.length; i < 16; i++) {
      this.hexArray.push(0)
    }
    this.createBlock()
    this.fillBlock()
    
    this.xtime = new Array(256)
    for (var i = 0; i < 128; i++) {
      this.xtime[i] = i << 1
      this.xtime[128 + i] = (i << 1) ^ 0x1b
    }
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
      row[4 - i] = temp
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
    // db 13 53 45 => 8e 4d a1 bc
    const column = [0xdb, 0x13, 0x53, 0x45]
    let columnCopy = [...column]
    //const column = [0xf2, 0x0a, 0x22, 0x5c]
    //const column = [0x01, 0x01, 0x01, 0x01]
    //for (let i = 0; i < 4; i++) {
    //const column = this.block[0]
    // const c0 = this.gmul(column[0], 2) ^ this.gmul(column[1], 3) ^ this.gmul(column[2], 1) ^ this.gmul(column[3], 1)
    // const c1 = this.gmul(column[0], 1) ^ this.gmul(column[1], 2) ^ this.gmul(column[2], 3) ^ this.gmul(column[3], 1)
    // const c2 = this.gmul(column[0], 1) ^ this.gmul(column[1], 1) ^ this.gmul(column[2], 2) ^ this.gmul(column[3], 3)
    // const c3 = this.gmul(column[0], 3) ^ this.gmul(column[1], 1) ^ this.gmul(column[2], 1) ^ this.gmul(column[3], 2)
    // //}
    // const res = [c0, c1, c2, c3].map(char => decToHex(char)).join(" ")
    // console.log(res)

      let s0 = column[0];
      let s1 = column[1];
      let s2 = column[2];
      let s3 = column[3];
      let h = s0 ^ s1 ^ s2 ^ s3;
      columnCopy[0] ^= h ^ this.xtime[s0 ^ s1];
      columnCopy[1] ^= h ^ this.xtime[s1 ^ s2];
      columnCopy[2] ^= h ^ this.xtime[s2 ^ s3];
      columnCopy[3] ^= h ^ this.xtime[s3 ^ s0];

    console.log(columnCopy)




  }

  inverseMixColumns() {
    const state = [0x8e, 0x4d, 0xa1, 0xbc]
    let stateCopy = [...state]
      var s0 = state[0];
      var s1 = state[1];
      var s2 = state[2];
      var s3 = state[3];
      var h = s0 ^ s1 ^ s2 ^ s3;
      var xh = this.xtime[h];
      var h1 = this.xtime[this.xtime[xh ^ s0 ^ s2]] ^ h;
      var h2 = this.xtime[this.xtime[xh ^ s1 ^ s3]] ^ h;
      stateCopy[0] ^= h1 ^ this.xtime[s0 ^ s1];
      stateCopy[1] ^= h2 ^ this.xtime[s1 ^ s2];
      stateCopy[2] ^= h1 ^ this.xtime[s2 ^ s3];
      stateCopy[3] ^= h2 ^ this.xtime[s3 ^ s0];
      console.log(stateCopy.map(entry => decToHex(entry)).join(" "))
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

  const reverseMix = () => {
    b.inverseMixColumns()
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
        <button onClick={() => reverseMix()}>Reverse</button>
        <button onClick={() => xor()}>XOR</button>
      </div>
    </>
  )
}

export default AES