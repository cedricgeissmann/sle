import { useEffect, useState, useRef } from 'react'
import { keyToAlphabet, shiftChar, codeToChar } from './utils'

export function ShiftingLetter({letter, opacity, myClass, myStyle, shift}) {

  const [style, setStyle] = useState({
    color: `rgba(255, 255, 255, ${opacity}`,
    border: `1px solid rgba(255, 255, 255, ${opacity})`,
  })

  useEffect(() => {
    console.log(letter)
    letter.letter = shiftChar(letter.letter, shift)
  }, [])

  useEffect(() => {
    if (letter.active) {
      setStyle({
        color: `rgba(255, 0, 0, ${opacity})`,
        border: `2px solid rgba(255, 0, 0, ${opacity})`,
      })
    } else {
      setStyle({
        color: `rgba(255, 255, 255, ${opacity}`,
        border: `1px solid rgba(255, 255, 255, ${opacity})`,
      })
    }
  }, [letter.active, opacity])

  return (
    <div
      className={`${myClass} video-letter`}
      style={{...style, ...myStyle}}
    >
      {letter.letter}
    </div>
  )
}

export function Letter({letter, opacity, myClass, myStyle}) {

  const [style, setStyle] = useState({
    color: `rgba(255, 255, 255, ${opacity}`,
    border: `1px solid rgba(255, 255, 255, ${opacity})`,
  })

  useEffect(() => {
    if (letter.active) {
      setStyle({
        color: `rgba(255, 0, 0, ${opacity})`,
        border: `2px solid rgba(255, 0, 0, ${opacity})`,
      })
    } else {
      setStyle({
        color: `rgba(255, 255, 255, ${opacity}`,
        border: `1px solid rgba(255, 255, 255, ${opacity})`,
      })
    }
  }, [letter.active, opacity])

  return (
    <div
      className={`${myClass} video-letter`}
      style={{...style, ...myStyle}}
    >
      {letter.letter}
    </div>
  )
}

export function LetterList({ letters, gap, shiftInputUpwards, opacity, type, myClass, style, letterStyle }) {

  return (
    <div className="letter-list"
      style={{
        ...style,
        gap: `${gap}rem`,
        transform: `translateY(${-shiftInputUpwards}%)`,
      }}
    >
      {letters.map((letter, index) => (
        <Letter myStyle={{ ...letterStyle }} letter={letter} opacity={opacity} key={`${type}-${index}`} type={type} myClass={myClass} />
      ))}
    </div>
  );
}
