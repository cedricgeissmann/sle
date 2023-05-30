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
}

function stringToHex(str) {
  return str.split("").map(char => {
    return char.charCodeAt(0).toString(16)
  }).join(" ")
}

function hexToBlock(hex) {
  const b = new Block(hex)
  console.log(b)
}

function AES() {

  const [input, setInput] = useState('secret');
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput(stringToHex(input));
  }, [input])

  useEffect(() => {
    hexToBlock(output);
  }, [output])

  return (
    <>
      <h2>AES</h2>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <span>{output}</span>
    </>
  )
}

export default AES