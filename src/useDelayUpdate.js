import { useState, useEffect } from 'react'

export default function useDelayUpdate(initialValue, timeout = 0) {
  const [value, setValue] = useState(() => {
    return initialValue
  })
  const [show, setShow] = useState(initialValue)

  useEffect(() => {
    setTimeout(() => setShow(value), timeout)
  }, [value])


  return [show, setValue]
}