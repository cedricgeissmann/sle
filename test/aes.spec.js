import { describe, it, expect } from "vitest";
import { decToHex, stringToHex, splitHLBytes } from "/src/utils.js";
import { Block } from "/src/AES.jsx";

describe("Utility functions for AES", () => {
  it("should convert dec to hex", () => {
    expect(decToHex(15)).toBe('0F');
  });

  it("should keep same reference", () => {
    const b = new Block("secret")
    const ref1 = b.block
    const copy = [...b.block]
    expect(b.block).toEqual(copy)
    b.shiftRows()
    expect(b.block).toBe(ref1)
    // expect(b.block).not.toEqual(copy)
  })

  it("should have a hex array", () => {
    const b = new Block("secret")
    expect(b.hexArray).toBeInstanceOf(Array)
    expect(b.hexArray).toHaveLength(16)
  })

  it("should have a dec array", () => {
    const b = new Block("secret")
    expect(b.decArray).toBeInstanceOf(Array)
    expect(b.decArray).toHaveLength(16)
  })

  it("should trim to fit the block", () => {
    const b = new Block("this is a very long string that does not fit the box")
    expect(b.hexArray).toHaveLength(16)
  })

  it("should xor to blocks", () => {
    const b = new Block("secret")
    const key = new Block("key")
    const res = [
      '18', '00', '1A', '72',
      '65', '74', '00', '00',
      '00', '00', '00', '00',
      '00', '00', '00', '00'
    ]
    b.xor(key)
    expect(b.hexArray).toEqual(res)
  })

  it("should reverse itself", () => {
    const a = new Block("a very long stri")
    const b = new Block("a very long stri")
    const key = new Block("just some random key")
    b.xor(key)
    b.xor(key)
    expect(b.hexArray).toEqual(a.hexArray)
  })

  it("should substitute in the sbox", () => {
    const b = new Block("A")
    const res = [
      '83', '63', '63', '63',
      '63', '63', '63', '63',
      '63', '63', '63', '63',
      '63', '63', '63', '63'
    ]
    b.subBytes()
    expect(b.hexArray).toEqual(res)
  })

  it("should reverse substitution in the sbox", () => {
    const a = new Block("just some random strings")
    const b = new Block("just some random strings")
    b.subBytes()
    expect(b.hexArray).not.toEqual(a.hexArray)
    b.subBytes({backward: true})
    expect(b.hexArray).toEqual(a.hexArray)
  })

  it("should split '02' correctly", () => {
    const byte = '02'
    const [h, l] = splitHLBytes(byte)
    expect(h).toBe(0x0)
    expect(l).toBe(0x2)
  })

  it("should split '9D' correctly", () => {
    const byte = '9D'
    const [h, l] = splitHLBytes(byte)
    expect(h).toBe(0x9)
    expect(l).toBe(0xD)
  })

  it("should shift rows", () => {
    const b = new Block("secret")
    const res = [
      [ '73', '65', '00', '00' ],
      [ '74', '00', '00', '65' ],
      [ '00', '00', '63', '00' ],
      [ '00', '72', '00', '00' ]
    ]
    console.log(b.toBlock())
    b.shiftRows()
    console.log(b.toBlock())
    expect(b.toBlock()).toEqual(res)
  })

})