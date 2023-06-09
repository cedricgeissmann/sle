import { describe, it, expect } from "vitest";
import { decToHex, stringToHex, splitHLBytes } from "/src/utils.js";
import { Block } from "/src/AES.jsx";
import { expandKey, inverseMixColumns, mixColumns, aes, aes_reverse } from "../src/utils";

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
    b.shiftRows()
    expect(b.toBlock()).toEqual(res)
  })

  // it("should mix columns", () => {
  //   const col = ["F2", "0A", "22", "5C"]
  //   const res = ["9F", "DC", "58", "9D"]

  //   const calc = mixColumns(col)
  //   expect(calc).toEqual(res)
  // })

  // it("should inverse mix columns", () => {
  //   const col = ["9F", "DC", "58", "9D"]
  //   const res = ["F2", "0A", "22", "5C"]

  //   const calc = inverseMixColumns(col)
  //   expect(calc).toEqual(res)
  // })

  it("should reverse the column mix", () => {
    const res = [
      "8E", "4D", "A1", "BC",
      "9F", "DC", "58", "9D",	
      "01", "01", "01", "01",	
      "C6", "C6", "C6", "C6",
    ]
    const a = new Block("i want to mix this thing up")
    a.hexArray = [
      "DB", "13", "53", "45",
      "F2", "0A", "22", "5C",	
      "01", "01", "01", "01",
      "C6", "C6", "C6", "C6",
    ]
    const b = new Block("i want to mix this thing up")
    b.hexArray = [
      "DB", "13", "53", "45",
      "F2", "0A", "22", "5C",	
      "01", "01", "01", "01",
      "C6", "C6", "C6", "C6",
    ]

    expect(b.hexArray).toEqual(a.hexArray)
    b.mixColumns()
    expect(b.hexArray).not.toEqual(a.hexArray)
    expect(b.hexArray).toEqual(res)
    b.inverseMixColumns()
    expect(b.hexArray).toEqual(a.hexArray)
  })

  it("should expand the key", () => {
    const key = new Block("yellow submarine")
    const newKey = expandKey(key.hexArray)
    expect(newKey).toHaveLength(16 * 11)
  })

  it("should end to end test", () => {
    const key = new Block("yellow submarine")
    key.hexArray = [
      "E8", "E9", "EA", "EB", "ED", "EE", "EF", "F0", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "FA", 
    ]
    // plain: 398015413e7de1a8878bdba8176468c4
    // cypher: 014baf2278a69d331d5180103643e99a
    const newKey = expandKey(key.hexArray)
    expect(newKey).toHaveLength(16 * 11)
    const b = new Block("I want to encode this thing")
    b.hexArray = ["39", "80", "15", "41", "3E", "7D", "E1", "A8", "87", "8B", "DB", "A8", "17", "64", "68", "C4", ]
    const res = ["01", "4B", "AF", "22", "78", "A6", "9D", "33", "1D", "51", "80", "10", "36", "43", "E9", "9A", ]

    const backupB = [...b.hexArray]
    b.addKey(newKey.slice(0, 16))
    expect(b.hexArray).not.toEqual(backupB)

    // Rounds
    for (let i = 1; i < 10; i++) {
      b.subBytes();
      b.shiftRows();
      b.mixColumns(b);
      b.addKey(newKey.slice(i * 16, (i + 1) * 16));
    }

    // Final Round
    b.subBytes();
    b.shiftRows();
    b.addKey(newKey.slice(160, 176));

    expect(b.hexArray).toEqual(res)
  })

  it("should directly end to end test", () => {
    const key = [
      "E8", "E9", "EA", "EB", "ED", "EE", "EF", "F0", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "FA", 
    ]
    const clearText = ["39", "80", "15", "41", "3E", "7D", "E1", "A8", "87", "8B", "DB", "A8", "17", "64", "68", "C4", ]
    const cipherText = ["01", "4B", "AF", "22", "78", "A6", "9D", "33", "1D", "51", "80", "10", "36", "43", "E9", "9A", ]

    const res = aes(clearText, key)
    expect(res).toEqual(cipherText)
  })

  it("should go there and back again", () => {
    const key = [
      "E8", "E9", "EA", "EB", "ED", "EE", "EF", "F0", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "FA", 
    ]
    const clearText = ["39", "80", "15", "41", "3E", "7D", "E1", "A8", "87", "8B", "DB", "A8", "17", "64", "68", "C4", ]
    const cipherText = ["01", "4B", "AF", "22", "78", "A6", "9D", "33", "1D", "51", "80", "10", "36", "43", "E9", "9A", ]

    const res = aes(clearText, key)
    expect(res).toEqual(cipherText)
    const orig = aes_reverse(res, key)
    expect(orig).toEqual(clearText)
  })

})