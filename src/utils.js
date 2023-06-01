export function getSessionStorageOrDefault(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export function keyToAlphabet(key) {
  return key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
}

export function codeToChar(code) {
  return String.fromCharCode(code + 'a'.charCodeAt(0))
}

export function shiftChar(char, shift) {
  const charCode = keyToAlphabet(char)
  return codeToChar((charCode + 26 + shift) % 26)
}
