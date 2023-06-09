import { describe, it, expect } from "vitest";
import { decToHex, stringToHex, splitHLBytes } from "/src/utils.js";
import { Block } from "/src/AES.jsx";
import { expandKey, inverseMixColumns, mixColumns, subBytes, aes, aes_reverse, xor_list, shiftRows, addKey, stringToHexArray, hexStringToString } from "../src/utils";

describe("Utility functions for AES", () => {
  it("should convert dec to hex", () => {
    expect(decToHex(15)).toBe('0F');
  });

  it("should have a hex array", () => {
    const b = new Block("secret")
    expect(b.hexArray).toBeInstanceOf(Array)
    expect(b.hexArray).toHaveLength(16)
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
    const result = xor_list(b.hexArray, key.hexArray)
    expect(result).toEqual(res)
  })

  it("should reverse itself", () => {
    const a = new Block("a very long stri")
    const b = new Block("a very long stri")
    const key = new Block("just some random key")
    const res = xor_list(b.hexArray, key.hexArray)
    const orig = xor_list(res, key.hexArray)
    expect(b.hexArray).toEqual(orig)
  })

  it("should substitute in the sbox", () => {
    const b = new Block("A")
    const res = [
      '83', '63', '63', '63',
      '63', '63', '63', '63',
      '63', '63', '63', '63',
      '63', '63', '63', '63'
    ]
    subBytes(b.hexArray)
    expect(b.hexArray).toEqual(res)
  })

  it("should reverse substitution in the sbox", () => {
    const a = new Block("just some random strings")
    const b = new Block("just some random strings")
    subBytes(b.hexArray)
    expect(b.hexArray).not.toEqual(a.hexArray)
    subBytes(b.hexArray, {backward: true})
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
      '73', '74', '00', '00', '65', '00', '00', '72', '00', '00', '63', '00', '00', '65', '00', '00'
    ]
    shiftRows(b.hexArray)
    expect(b.hexArray).toEqual(res)
  })

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
    mixColumns(b.hexArray)
    expect(b.hexArray).not.toEqual(a.hexArray)
    expect(b.hexArray).toEqual(res)
    inverseMixColumns(b.hexArray)
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
    addKey(b.hexArray, newKey.slice(0, 16))
    expect(b.hexArray).not.toEqual(backupB)

    // Rounds
    for (let i = 1; i < 10; i++) {
      subBytes(b.hexArray);
      shiftRows(b.hexArray);
      mixColumns(b.hexArray);
      addKey(b.hexArray, newKey.slice(i * 16, (i + 1) * 16));
    }

    // Final Round
    subBytes(b.hexArray);
    shiftRows(b.hexArray);
    addKey(b.hexArray, newKey.slice(160, 176));

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

  it("should convert a string to hex array", () => {
    const str = "Hello"
    const hex = stringToHexArray(str)
    expect(hex).toBeInstanceOf(Array)
    expect(hex).toHaveLength(5)
  })

  it("should convert to hex and back again", () => {
    const str = "Hello"
    const hex = stringToHexArray(str)
    expect(hex).toBeInstanceOf(Array)
    expect(hex).toHaveLength(5)
    const orig = hexStringToString(hex)
    expect(orig).toBeTypeOf('string')
    expect(orig).toEqual(str)
  })

})