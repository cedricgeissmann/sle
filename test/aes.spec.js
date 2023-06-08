import { describe, it, expect } from "vitest";
import { decToHex, stringToHex } from "/src/utils.js";
import { Block } from "/src/AES.jsx";

describe("Utility functions for AES", () => {
  it("should convert dec to hex", () => {
    expect(decToHex(15)).toBe('0F');
  });

  it("should keep same reference", () => {
    const b = new Block(stringToHex("secret"))
    const ref1 = b.block
    const copy = [...b.block]
    console.log(b.block, copy)
    expect(b.block).toEqual(copy)
    b.shiftRows()
    expect(b.block).toBe(ref1)
    console.log(b.block, copy)
    expect(b.block).not.toEqual(copy)
  })
})