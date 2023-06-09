import { Sequence, AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion'
import { useEffect } from 'react'
import { useState } from 'react'
import PWComponent from './PWComponent'

export function VideoTransform({from, to, style_}) {
  const frame = useCurrentFrame()
  const {durationInFrames} = useVideoConfig()
  const opacityFrom = interpolate(frame, [0, durationInFrames], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})
  const opacityTo = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'})

  return (
    <>
      <div style={{...style_, minWidth: '200px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'absolute', color: `rgba(255, 255, 255, ${opacityFrom})`}}>{from}</div>
        <div style={{position: 'absolute', color: `rgba(255, 255, 255, ${opacityTo})`}}>{to}</div>
      </div>
    </>
  )
}

export function VideoTransformF({states, style_}) {
  const frame = useCurrentFrame()
  const {durationInFrames} = useVideoConfig()
  const [index, setIndex] = useState(0)
  const [indexAnim, setIndexAnim] = useState(0)
  const numTicks = Math.floor(durationInFrames / (3 * states.length - 1))
  const [anim, setAnim] = useState('')

  useEffect(() => {
    if (frame !== 0 && index < (numTicks-1) * 3 && frame % numTicks === 0) {
      if (indexAnim === 0) {
        setAnim('anim-flip')
        setIndexAnim(i => i+1)
      } else if (indexAnim === 1) {
        setAnim('')
        setIndexAnim(i => i+1)
        setIndex(i => Math.min(i+1, states.length - 1))
      } else {
        setIndexAnim(0)
      }
    }
  }, [frame])


  return (
    <>
      <div style={{...style_, minWidth: '200px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className={anim}>{states[index]}</div>
      </div>
    </>
  )
}


export function VideoElement({children, top, left, right, bottom, transform, style_, transparency = 1}) {
  const transparencyValue = typeof transparency === 'function' ? transparency() : transparency
  return (
      <div style={{
        ...style_,
        position: 'absolute',
        color: `rgba(255, 255, 255, ${transparencyValue})`,
        top: typeof top === 'function' ? top() : top,
        left: typeof left === 'function' ? left() : left,
        right: typeof right === 'function' ? right() : right,
        bottom: typeof bottom === 'function' ? bottom() : bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: typeof transform === 'function' ? transform() : transform,
      }}>
        {children}
      </div>
  )
}


export function MySequence({children, from, durationInFrames}) {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        {children}
      </AbsoluteFill>
    </Sequence>
  )
}

export function VideoChapterContainer({chapters, video, playbackRate, setPlaybackRate}) {

  function faster() {
    setPlaybackRate((cur) => Math.min(cur * 2, 4))
  }
  function slower() {
    setPlaybackRate((cur) => Math.max(cur / 2, 0.125))
  }

  return (
    <PWComponent>
    <div className='vid-container'>
      <div className='video-controls'>
        <button onClick={() => slower()}>Slower</button>
        <span>Speed: {playbackRate}</span>
        <button onClick={() => faster()}>Faster</button>
      </div>
    <div className="video-chapter">
      <ul>
        {chapters}
      </ul>
      <div>{video}</div>
    </div>
    </div>
    </PWComponent>
  )
}

export function VideoChapterLink({info, setInfo, playerRef, part, children}) {

  const [activePart, setActivePart] = useState('chapter-inactive')

  useEffect(() => {
    playerRef.current.addEventListener("frameupdate", e => {
      if (info[part].start < e.detail.frame && e.detail.frame < info[part].start + info[part].duration) {
        setActivePart('chapter-active')
      } else {
        setActivePart('chapter-inactive')
      }
    })
  }, [])
  function jumpToPart() {
    playerRef.current && playerRef.current.seekTo(info[part].start)
  }

  function togglePart() {
    setInfo((old) => {
      const inf = {...old}
      inf[part].show = !old[part].show
      return inf
    })
  }

  return <li className={activePart} onClick={() => jumpToPart()}>
    <span>
      {children}
    </span>
    <label htmlFor={`display-${part}`}>
      <input type="checkbox" id={`display-${part}`} defaultChecked={true} onChange={() => togglePart()} />
    </label>
    </li>
}



export function calcVideoDuration(info, options) {
  let sum = 0
  for (const [k, e] of Object.entries(info)) {
    e.start = sum
    if (e.show === true) {
      if (typeof e.duration === "function") {
        sum += e.duration(options)
      } else {
        sum = sum + e.duration
      }
    }
  }
  return sum
}

export function inter(frame, vidInfo, values) {
  return interpolate(
    frame,
    [vidInfo.start, vidInfo.start + vidInfo.duration],
    values, {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    })
}
