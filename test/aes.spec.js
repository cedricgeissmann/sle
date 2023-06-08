import { describe, it, expect } from "vitest";
import { decToHex, stringToHex } from "/src/utils.js";
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

  it("should hav a hex array", () => {
    const b = new Block("secret")
    expect(b.hexArray).toBeInstanceOf(Array)
    expect(b.hexArray).toHaveLength(16)
    console.log("b.hexArray", b.hexArray)
    console.log("As block", b.toBlock())
  })

  it("should hav a dec array", () => {
    const b = new Block("secret")
    expect(b.decArray).toBeInstanceOf(Array)
    expect(b.decArray).toHaveLength(16)
  })
})