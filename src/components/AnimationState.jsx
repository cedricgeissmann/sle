import { useEffect } from "react"
import { useState } from "react"
import "./AnimationState.css"

function AnimationState({children, trigger, timeout = 500}) {

  const [animationClass, setAnimationClass] = useState("")
  
  useEffect(() => {
    setAnimationClass(trigger)
    setTimeout(() => setAnimationClass("fadein"), timeout)
  }, [trigger])

  return (
    <div className={animationClass}>
      {children}
    </div>
  )
}

export default AnimationState;