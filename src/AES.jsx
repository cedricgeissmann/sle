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

  xor(otherBlock) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        console.log(this.block[i][j], otherBlock.block[i][j], this.block[i][j] ^ otherBlock.block[i][j])
        this.block[i][j] = this.block[i][j] ^ otherBlock.block[i][j]
      }
    }
  }
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
  const encrypt = () => {
    b.shiftRows()
    console.log(b.block)
  }
  const decrypt = () => {
    b.xor(k)
    console.log(b)
  }



  return (
    <>
      <h2>AES</h2>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <span>{output}</span>
      <div>
        <button onClick={() => show()}>Show Block</button>
        <button onClick={() => encrypt()}>Encrypt</button>
        <button onClick={() => decrypt()}>Decrypt</button>
      </div>
    </>
  )
}

export default AES